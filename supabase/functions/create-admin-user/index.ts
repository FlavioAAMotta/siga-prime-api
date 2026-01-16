import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateAdminRequest {
  email: string;
  password: string;
  nome: string;
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

    const { email, password, nome, telefone, ativo, instituicao_id }: CreateAdminRequest = await req.json();

    if (!email || !password || !nome) {
      return new Response(
        JSON.stringify({ error: "Email, senha e nome são obrigatórios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Criando usuário administrador: ${email}`);

    // Create user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Erro ao criar usuário:", authError);
      return new Response(
        JSON.stringify({ error: `Erro ao criar usuário: ${authError.message}` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create preceptor record
    const { data: preceptorData, error: preceptorError } = await supabaseAdmin
      .from("preceptores")
      .insert({
        nome: nome,
        email: email,
        telefone: telefone || null,
        especialidade: "Administrador",
        crm: null,
        ativo: ativo,
        instituicao_id: instituicao_id || null,
      })
      .select()
      .single();

    if (preceptorError) {
      console.error("Erro ao criar preceptor:", preceptorError);
      // If preceptor creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: `Erro ao criar registro do administrador: ${preceptorError.message}` }),
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

    // Create admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: authData.user.id,
        role: "admin",
      });

    if (roleError) {
      console.error("Erro ao criar role admin:", roleError);
      // This is not critical, just log it
    }

    // Create user_instituicao link if instituicao_id is provided
    if (instituicao_id) {
      const { error: instituicaoError } = await supabaseAdmin
        .from("user_instituicao")
        .insert({
          user_id: authData.user.id,
          instituicao_id: instituicao_id,
          ativa: true,
        });

      if (instituicaoError) {
        console.error("Erro ao vincular instituição:", instituicaoError);
      }
    }

    console.log("Administrador criado com sucesso:", preceptorData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        preceptor: preceptorData,
        message: "Administrador criado com sucesso!" 
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
    console.error("Erro na função create-admin-user:", error);
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