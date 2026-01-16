import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreatePreceptorUserRequest {
  email: string;
  usuario: string;
  nome: string;
  especialidade?: string;
  crm?: string;
  telefone?: string;
  ativo: boolean;
  instituicao_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { email, usuario, nome, especialidade, crm, telefone, ativo, instituicao_id }: CreatePreceptorUserRequest = await req.json();

    if (!email || !usuario || !nome) {
      return new Response(
        JSON.stringify({ error: "Email, usuário e nome são obrigatórios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Criando usuário preceptor: ${usuario} (${email})`);

    // Create user in Auth with default password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: "123456", // Senha padrão
      email_confirm: true,
    });

    if (authError) {
      console.error("Erro ao criar usuário:", authError);
      
      // Tratamento específico para email duplicado
      if (authError.message.includes('already been registered') || authError.message.includes('email_exists')) {
        return new Response(
          JSON.stringify({ error: "Este e-mail já está cadastrado no sistema. Por favor, use outro e-mail." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Erro ao criar usuário: ${authError.message}` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Resolve instituicao_id from caller's active institution (tenancy-safe)
    const authHeader = req.headers.get("Authorization") || "";
    const supabaseRls = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { 
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    let instituicaoId: string | null = null;
    const { data: ativaInst } = await supabaseRls
      .from("user_instituicao")
      .select("instituicao_id")
      .eq("ativa", true)
      .maybeSingle();

    instituicaoId = ativaInst?.instituicao_id ?? null;

    if (!instituicaoId) {
      const { data: anyInst } = await supabaseRls
        .from("user_instituicao")
        .select("instituicao_id")
        .order("created_at", { ascending: true })
        .limit(1);
      instituicaoId = anyInst?.[0]?.instituicao_id ?? null;
    }

    // Create preceptor record
    const { data: preceptorData, error: preceptorError } = await supabaseAdmin
      .from("preceptores")
      .insert({
        nome: nome,
        email: email,
        usuario: usuario,
        telefone: telefone || null,
        especialidade: especialidade || null,
        crm: crm || null,
        ativo: ativo,
        instituicao_id: instituicaoId,
      })
      .select()
      .single();

    if (preceptorError) {
      console.error("Erro ao criar preceptor:", preceptorError);
      // If preceptor creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      // Tratamento específico para usuário duplicado
      if (preceptorError.message.includes('preceptores_usuario_key')) {
        return new Response(
          JSON.stringify({ error: "Este nome de usuário já está em uso. Por favor, escolha outro." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Erro ao criar registro do preceptor: ${preceptorError.message}` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Link user to preceptor
    const { error: linkError } = await supabaseAdmin
      .from("preceptor_users")
      .insert({
        user_id: authData.user.id,
        preceptor_id: preceptorData.id,
      });

    if (linkError) {
      console.error("Erro ao vincular usuário:", linkError);
      // This is not critical, just log it
    }

    console.log("Preceptor criado com sucesso:", preceptorData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        preceptor: preceptorData,
        message: "Preceptor criado com sucesso! Senha padrão: 123456 (pode ser alterada após o login)" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Erro na função create-preceptor-user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);