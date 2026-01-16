import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar dados das últimas 24 horas
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Presenças
    const { data: presencas, error: presencasError } = await supabase
      .from("aluno_presencas")
      .select(`
        presente,
        data_presenca,
        alunos(nome),
        ambulatorios(nome)
      `)
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false });

    if (presencasError) throw presencasError;

    // Registros de ponto
    const { data: pontos, error: pontosError } = await supabase
      .from("registros_ponto")
      .select(`
        status_entrada,
        minutos_atraso_entrada,
        data_entrada,
        preceptores(nome),
        ambulatorios(nome)
      `)
      .gte("data_entrada", twentyFourHoursAgo)
      .order("data_entrada", { ascending: false });

    if (pontosError) throw pontosError;

    // Avaliações
    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from("avaliacoes")
      .select(`
        nota,
        tipo_avaliacao,
        alunos(nome)
      `)
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false });

    if (avaliacoesError) throw avaliacoesError;

    // Preparar dados para análise
    const dataContext = {
      presencas: {
        total: presencas?.length || 0,
        presentes: presencas?.filter(p => p.presente).length || 0,
        ausentes: presencas?.filter(p => !p.presente).length || 0,
        detalhes: presencas?.slice(0, 10) || []
      },
      pontos: {
        total: pontos?.length || 0,
        atrasos: pontos?.filter(p => p.status_entrada === "atraso").length || 0,
        pontuais: pontos?.filter(p => p.status_entrada === "pontual").length || 0,
        mediaMinutosAtraso: pontos?.length > 0 
          ? Math.round(pontos.reduce((acc, p) => acc + (p.minutos_atraso_entrada || 0), 0) / pontos.length)
          : 0,
        detalhes: pontos?.slice(0, 10) || []
      },
      avaliacoes: {
        total: avaliacoes?.length || 0,
        mediaNotas: avaliacoes?.length > 0
          ? (avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0) / avaliacoes.length).toFixed(1)
          : 0,
        detalhes: avaliacoes?.slice(0, 10) || []
      }
    };

    // Chamar Lovable AI para análise
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um assistente de análise acadêmica especializado em interpretar dados de frequência, pontualidade e desempenho de estudantes de medicina em ambulatórios.

Sua tarefa é analisar os dados das últimas 24 horas e gerar insights CONCISOS e RELEVANTES em português brasileiro.

Regras:
- Use emojis para destacar pontos importantes
- Seja objetivo e direto
- Destaque padrões interessantes ou preocupantes
- Use linguagem profissional mas acessível
- Máximo de 4-5 frases curtas
- Priorize informações ACIONÁVEIS`
          },
          {
            role: "user",
            content: `Analise estes dados das últimas 24 horas e gere insights relevantes:

${JSON.stringify(dataContext, null, 2)}

Gere uma análise concisa e útil com os principais insights e recomendações.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        analysis,
        stats: {
          presencas: dataContext.presencas.total,
          pontos: dataContext.pontos.total,
          avaliacoes: dataContext.avaliacoes.total,
          taxaPresenca: dataContext.presencas.total > 0 
            ? Math.round((dataContext.presencas.presentes / dataContext.presencas.total) * 100)
            : 0
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-recent-activity:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
