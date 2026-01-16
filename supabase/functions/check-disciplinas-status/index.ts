import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Iniciando verificação de status de disciplinas...');

    // Buscar disciplinas ativas que já passaram da data de fim
    const { data: disciplinasExpiradas, error: fetchError } = await supabase
      .from('disciplinas')
      .select('id, nome, data_fim')
      .eq('ativo', true)
      .not('data_fim', 'is', null)
      .lt('data_fim', new Date().toISOString().split('T')[0]);

    if (fetchError) {
      console.error('Erro ao buscar disciplinas:', fetchError);
      throw fetchError;
    }

    console.log(`Encontradas ${disciplinasExpiradas?.length || 0} disciplinas para inativar`);

    if (disciplinasExpiradas && disciplinasExpiradas.length > 0) {
      // Inativar disciplinas expiradas
      const { error: updateError } = await supabase
        .from('disciplinas')
        .update({ ativo: false })
        .in('id', disciplinasExpiradas.map(d => d.id));

      if (updateError) {
        console.error('Erro ao inativar disciplinas:', updateError);
        throw updateError;
      }

      console.log('Disciplinas inativadas:', disciplinasExpiradas.map(d => d.nome).join(', '));

      return new Response(
        JSON.stringify({
          success: true,
          inactivated: disciplinasExpiradas.length,
          disciplinas: disciplinasExpiradas.map(d => ({ id: d.id, nome: d.nome, data_fim: d.data_fim })),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Nenhuma disciplina precisa ser inativada');

    return new Response(
      JSON.stringify({
        success: true,
        inactivated: 0,
        message: 'Nenhuma disciplina precisa ser inativada',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na função check-disciplinas-status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
