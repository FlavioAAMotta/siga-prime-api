import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Reset preceptor password function called')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Supabase service role client
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { preceptorId } = await req.json()
    console.log('Resetting password for preceptor:', preceptorId)

    if (!preceptorId) {
      throw new Error('ID do preceptor é obrigatório')
    }

    // Get preceptor data
    const { data: preceptor, error: preceptorError } = await supabaseServiceRole
      .from('preceptores')
      .select('email')
      .eq('id', preceptorId)
      .single()

    if (preceptorError || !preceptor) {
      console.error('Error finding preceptor:', preceptorError)
      throw new Error('Preceptor não encontrado')
    }

    if (!preceptor.email) {
      throw new Error('Preceptor não possui email cadastrado')
    }

    // Normalize email
    const email = String(preceptor.email).trim().toLowerCase()

    // Find user by email with pagination (handles >50 users)
    async function findUserByEmail(targetEmail: string) {
      let page = 1
      const perPage = 1000
      while (true) {
        const { data, error } = await supabaseServiceRole.auth.admin.listUsers({ page, perPage })
        if (error) {
          console.error('Error listing users:', error)
          throw new Error('Erro ao buscar usuários')
        }
        const found = data.users.find((u) => (u.email || '').toLowerCase() === targetEmail)
        if (found) return found
        if (data.users.length < perPage) break
        page += 1
      }
      return null
    }

    let user = await findUserByEmail(email)
    
    // If user doesn't exist, create it
    if (!user) {
      console.log('User not found in auth, creating new user with email:', email)
      const { data: newUser, error: createError } = await supabaseServiceRole.auth.admin.createUser({
        email,
        password: '123456',
        email_confirm: true,
      })

      if (createError || !newUser.user) {
        // If user already exists (race condition or pagination miss), try to find again
        if (createError?.message?.toLowerCase().includes('already') || createError?.status === 422) {
          console.warn('User may already exist, re-attempting lookup...')
          user = await findUserByEmail(email)
        }
        if (!user) {
          console.error('Error creating user:', createError)
          throw new Error('Erro ao criar usuário: ' + (createError?.message || 'desconhecido'))
        }
      } else {
        user = newUser.user
        console.log('User created successfully')
      }
    }

    // Ensure password is set to 123456
    console.log('Setting password for user:', user.id)
    const { error: resetError } = await supabaseServiceRole.auth.admin.updateUserById(user.id, { password: '123456' })
    if (resetError) {
      console.error('Error resetting password:', resetError)
      throw new Error('Erro ao resetar senha: ' + resetError.message)
    }

    console.log('Password reset successfully for preceptor:', preceptorId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Senha resetada para 123456 com sucesso!' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in reset-preceptor-password function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})