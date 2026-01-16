import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching database context...");

    // Buscar dados relevantes
    const [
      { data: preceptores },
      { data: alunos },
      { data: presencas },
      { data: avaliacoes },
      { data: ambulatorios }
    ] = await Promise.all([
      supabase.from('preceptores').select('*').eq('ativo', true).limit(100),
      supabase.from('alunos').select('*, turmas(nome)').eq('ativo', true).limit(100),
      supabase.from('aluno_presencas').select('*').limit(100),
      supabase.from('avaliacoes').select('*').limit(100),
      supabase.from('ambulatorios').select('*').eq('ativo', true).limit(50)
    ]);

    const contextData = {
      preceptores: preceptores || [],
      alunos: alunos || [],
      presencas: presencas || [],
      avaliacoes: avaliacoes || [],
      ambulatorios: ambulatorios || []
    };

    console.log("Context data fetched:", {
      preceptores: contextData.preceptores.length,
      alunos: contextData.alunos.length,
      presencas: contextData.presencas.length,
      avaliacoes: contextData.avaliacoes.length
    });

    const systemPrompt = `Você é um assistente inteligente para um sistema de gestão acadêmica de medicina. 
Você tem acesso aos seguintes dados:

PRECEPTORES (${contextData.preceptores.length}):
${JSON.stringify(contextData.preceptores, null, 2)}

ALUNOS (${contextData.alunos.length}):
${JSON.stringify(contextData.alunos, null, 2)}

PRESENÇAS (${contextData.presencas.length}):
${JSON.stringify(contextData.presencas, null, 2)}

AVALIAÇÕES (${contextData.avaliacoes.length}):
${JSON.stringify(contextData.avaliacoes, null, 2)}

AMBULATÓRIOS (${contextData.ambulatorios.length}):
${JSON.stringify(contextData.ambulatorios, null, 2)}

Responda em português brasileiro de forma clara e útil. Use os dados acima para responder perguntas sobre:
- Desempenho de alunos e preceptores
- Frequências e presenças
- Avaliações e notas
- Estatísticas gerais
- Análises e insights

Seja objetivo e forneça informações específicas baseadas nos dados reais.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []).slice(-5), // Keep last 5 messages for context
      { role: "user", content: message }
    ];

    console.log("Calling Lovable AI...");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
