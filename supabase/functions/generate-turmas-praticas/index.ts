import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  turma_periodo_id: string;
  disciplina_id: string;
  criterio: 'alfabetico' | 'balanceado';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { turma_periodo_id, disciplina_id, criterio }: GenerateRequest = await req.json();

    console.log('Iniciando geração de turmas práticas', { turma_periodo_id, disciplina_id, criterio });

    // 1. Buscar alunos da turma de período
    const { data: alunos, error: alunosError } = await supabaseClient
      .from('alunos')
      .select('id, nome, matricula')
      .eq('turma_id', turma_periodo_id)
      .eq('ativo', true)
      .order('nome');

    if (alunosError) throw alunosError;
    if (!alunos || alunos.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nenhum aluno encontrado na turma' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Encontrados ${alunos.length} alunos`);

    // 2. Buscar horários disponíveis (preceptor_ambulatorio) para a disciplina
    const { data: horarios, error: horariosError } = await supabaseClient
      .from('preceptor_ambulatorio')
      .select(`
        id,
        dia_semana,
        horario_inicio,
        horario_fim,
        periodo,
        ambulatorio_id,
        preceptor_id,
        ambulatorios!inner(nome, capacidade, disciplina_id),
        preceptores(nome)
      `)
      .eq('ativo', true)
      .eq('ambulatorios.disciplina_id', disciplina_id)
      .is('turma', null); // Apenas horários sem turma atribuída

    if (horariosError) throw horariosError;
    if (!horarios || horarios.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nenhum horário disponível para esta disciplina' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Encontrados ${horarios.length} horários disponíveis`);

    // 3. Calcular capacidade total
    const capacidadeTotal = horarios.reduce((sum, h: any) => sum + (h.ambulatorios?.capacidade || 1), 0);

    if (capacidadeTotal < alunos.length) {
      return new Response(
        JSON.stringify({ 
          error: `Capacidade insuficiente. Total de vagas: ${capacidadeTotal}, Alunos: ${alunos.length}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Ordenar alunos conforme critério
    let alunosOrdenados = [...alunos];
    if (criterio === 'alfabetico') {
      alunosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    // 5. Distribuir alunos pelos horários
    const distribuicao: Record<string, string[]> = {};
    let alunoIndex = 0;

    for (const horario of horarios) {
      const capacidade = (horario as any).ambulatorios?.capacidade || 1;
      const horarioId = horario.id;
      distribuicao[horarioId] = [];

      for (let i = 0; i < capacidade && alunoIndex < alunos.length; i++) {
        distribuicao[horarioId].push(alunos[alunoIndex].id);
        alunoIndex++;
      }
    }

    console.log('Distribuição calculada', distribuicao);

    // 6. Criar turmas práticas e associações
    const turmasCriadas = [];
    const associacoes = [];

    for (const horario of horarios) {
      const alunosHorario = distribuicao[horario.id];
      if (!alunosHorario || alunosHorario.length === 0) continue;

      const ambulatorioNome = (horario as any).ambulatorios?.nome || 'Ambulatório';
      const diaNome = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][horario.dia_semana];
      const horarioInicio = horario.horario_inicio?.slice(0, 5) || '';
      const turmaNome = `Prática ${diaNome} ${horarioInicio} - ${ambulatorioNome}`;

      // Buscar instituicao_id da turma de período
      const { data: turmaPeriodo } = await supabaseClient
        .from('turmas')
        .select('instituicao_id')
        .eq('id', turma_periodo_id)
        .single();

      // Criar turma prática
      const { data: turmaCriada, error: turmaError } = await supabaseClient
        .from('turmas')
        .insert({
          nome: turmaNome,
          tipo: 'pratica',
          ativo: true,
          capacidade: alunosHorario.length,
          turma_periodo_id: turma_periodo_id,
          instituicao_id: turmaPeriodo?.instituicao_id
        })
        .select()
        .single();

      if (turmaError) throw turmaError;

      turmasCriadas.push(turmaCriada);

      // Associar turma prática com a disciplina
      const { error: turmaDisciplinaError } = await supabaseClient
        .from('turma_disciplinas')
        .insert({
          turma_id: turmaCriada.id,
          disciplina_id: disciplina_id
        });

      if (turmaDisciplinaError) throw turmaDisciplinaError;

      // Atualizar preceptor_ambulatorio com o nome da turma
      const { error: updateError } = await supabaseClient
        .from('preceptor_ambulatorio')
        .update({ turma: turmaNome })
        .eq('id', horario.id);

      if (updateError) throw updateError;

      // Criar associações aluno-turma prática
      for (const alunoId of alunosHorario) {
        associacoes.push({
          aluno_id: alunoId,
          turma_pratica_id: turmaCriada.id
        });
      }
    }

    // Inserir todas as associações
    if (associacoes.length > 0) {
      const { error: associacoesError } = await supabaseClient
        .from('aluno_turma_pratica')
        .insert(associacoes);

      if (associacoesError) throw associacoesError;
    }

    console.log(`Criadas ${turmasCriadas.length} turmas práticas com ${associacoes.length} associações`);

    return new Response(
      JSON.stringify({
        success: true,
        turmas_criadas: turmasCriadas.length,
        alunos_distribuidos: associacoes.length,
        turmas: turmasCriadas
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erro ao gerar turmas práticas:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
