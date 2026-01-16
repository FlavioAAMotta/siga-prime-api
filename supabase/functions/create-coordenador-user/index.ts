import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Create coordenador user function called')

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { coordenadorId } = await req.json()
    console.log('Creating/resetting user for coordenador:', coordenadorId)

    if (!coordenadorId) {
      throw new Error('ID do coordenador é obrigatório')
    }

    // Get coordenador data
    const { data: coordenador, error: coordenadorError } = await supabaseServiceRole
      .from('coordenadores')
      .select('email, nome')
      .eq('id', coordenadorId)
      .single()

    if (coordenadorError || !coordenador) {
      console.error('Error finding coordenador:', coordenadorError)
      throw new Error('Coordenador não encontrado')
    }

    if (!coordenador.email) {
      throw new Error('Coordenador não possui email cadastrado')
    }

    const email = String(coordenador.email).trim().toLowerCase()

    // Find user by email with pagination
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
        user_metadata: {
          nome: coordenador.nome,
          tipo_usuario: 'coordenador'
        }
      })

      if (createError || !newUser.user) {
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
    const { error: resetError } = await supabaseServiceRole.auth.admin.updateUserById(user.id, { 
      password: '123456',
      user_metadata: {
        nome: coordenador.nome,
        tipo_usuario: 'coordenador'
      }
    })
    if (resetError) {
      console.error('Error resetting password:', resetError)
      throw new Error('Erro ao resetar senha: ' + resetError.message)
    }

    // Link user to coordenador
    const { error: linkError } = await supabaseServiceRole
      .from('coordenador_users')
      .upsert({ user_id: user.id, coordenador_id: coordenadorId }, { onConflict: 'user_id,coordenador_id' })
    
    if (linkError) {
      console.error('Error linking user:', linkError)
      throw new Error('Erro ao vincular usuário: ' + linkError.message)
    }

    // Ensure user has coordenador role
    const { error: roleError } = await supabaseServiceRole
      .from('user_roles')
      .upsert({ user_id: user.id, role: 'coordenador' }, { onConflict: 'user_id,role' })
    
    if (roleError) {
      console.error('Error assigning role:', roleError)
      throw new Error('Erro ao atribuir role: ' + roleError.message)
    }

    console.log('User created/updated successfully for coordenador:', coordenadorId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Usuário criado/atualizado com sucesso! Senha padrão: 123456'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in create-coordenador-user function:', error)
    
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
