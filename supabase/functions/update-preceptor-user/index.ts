import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Update preceptor user function called')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseServiceRole = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { preceptorId, nome, usuario, especialidade, crm, email, telefone, ativo } = await req.json()
    
    console.log('Updating preceptor:', preceptorId, 'with user:', usuario)

    // Pre-check requirements before updating to avoid partial updates
    let needsUserCreation = false
    if (usuario && usuario.trim() !== '') {
      const { data: existingLinkPre } = await supabaseServiceRole
        .from('preceptor_users')
        .select('id')
        .eq('preceptor_id', preceptorId)
        .maybeSingle()
      if (!existingLinkPre) {
        needsUserCreation = true
        if (!email || email.trim() === '') {
          throw new Error('Informe um e-mail para criar a conta de login')
        }
      }
    }

    // 1. Update preceptores table
    const updateData: any = { nome, especialidade, crm, email, telefone, ativo }
    if (usuario !== undefined) {
      updateData.usuario = usuario
    }

    const { error: updateError } = await supabaseServiceRole
      .from('preceptores')
      .update(updateData)
      .eq('id', preceptorId)

    if (updateError) {
      console.error('Error updating preceptor:', updateError)
      throw new Error(`Erro ao atualizar preceptor: ${updateError.message}`)
    }

    // 2. Handle user account creation and linking if usuario is provided
    if (usuario && usuario.trim() !== '') {
      // Check if preceptor already has a linked user
      const { data: existingLink } = await supabaseServiceRole
        .from('preceptor_users')
        .select('id')
        .eq('preceptor_id', preceptorId)
        .maybeSingle()

      if (!existingLink) {
        // Validate email is provided for user creation
        if (!email || email.trim() === '') {
          throw new Error('Informe um e-mail para criar a conta de login')
        }

        // Check if user already exists with this email
        const { data: existingUsers } = await supabaseServiceRole.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.email === email)
        
        let userId: string

        if (existingUser) {
          userId = existingUser.id
          console.log('User already exists with email:', email)
        } else {
          // Create new user
          const { data: newUser, error: createError } = await supabaseServiceRole.auth.admin.createUser({
            email: email,
            password: '123456',
            email_confirm: true
          })

          if (createError) {
            console.error('Error creating user:', createError)
            throw new Error(`Erro ao criar usuário: ${createError.message}`)
          }

          userId = newUser.user!.id
          console.log('Created new user with id:', userId)
        }

        // Create link in preceptor_users
        const { error: linkError } = await supabaseServiceRole
          .from('preceptor_users')
          .insert({ user_id: userId, preceptor_id: preceptorId })

        if (linkError) {
          console.error('Error linking user to preceptor:', linkError)
          throw new Error(`Erro ao vincular usuário ao preceptor: ${linkError.message}`)
        }

        console.log('Successfully linked user to preceptor')
      }
    }

    return new Response(
      JSON.stringify({ message: 'Preceptor atualizado com sucesso' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in update-preceptor-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})