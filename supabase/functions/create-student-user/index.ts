import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Create student user function called')

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
    const { studentId } = await req.json()
    console.log('Creating/resetting user for student:', studentId)

    if (!studentId) {
      throw new Error('ID do estudante é obrigatório')
    }

    // Get student data
    const { data: student, error: studentError } = await supabaseServiceRole
      .from('alunos')
      .select('matricula, email, nome')
      .eq('id', studentId)
      .single()

    if (studentError || !student) {
      console.error('Error finding student:', studentError)
      throw new Error('Estudante não encontrado')
    }

    if (!student.matricula) {
      throw new Error('Estudante não possui matrícula cadastrada')
    }

    // Use matricula as login identifier
    const matricula = String(student.matricula).trim()
    // Use email if available, otherwise create a dummy email based on matricula
    const email = student.email ? String(student.email).trim().toLowerCase() : `${matricula}@student.local`

    console.log('Using matricula:', matricula, 'and email:', email)

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
        user_metadata: {
          matricula: matricula,
          nome: student.nome,
          tipo_usuario: 'estudante'
        }
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
    const { error: resetError } = await supabaseServiceRole.auth.admin.updateUserById(user.id, { 
      password: '123456',
      user_metadata: {
        matricula: matricula,
        nome: student.nome,
        tipo_usuario: 'estudante'
      }
    })
    if (resetError) {
      console.error('Error resetting password:', resetError)
      throw new Error('Erro ao resetar senha: ' + resetError.message)
    }

    // Ensure user has estudante role
    const { error: roleError } = await supabaseServiceRole
      .from('user_roles')
      .upsert({ user_id: user.id, role: 'estudante' }, { onConflict: 'user_id,role' })
    
    if (roleError) {
      console.error('Error assigning role:', roleError)
      throw new Error('Erro ao atribuir role: ' + roleError.message)
    }

    // Link user to aluno in aluno_users table
    const { error: linkError } = await supabaseServiceRole
      .from('aluno_users')
      .upsert({ user_id: user.id, aluno_id: studentId }, { onConflict: 'user_id,aluno_id' })
    
    if (linkError) {
      console.error('Error linking user to aluno:', linkError)
      throw new Error('Erro ao vincular usuário ao aluno: ' + linkError.message)
    }

    console.log('User created/updated successfully for student:', studentId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Usuário criado/atualizado com sucesso! Login: ' + matricula + ', Senha: 123456',
        matricula: matricula
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in create-student-user function:', error)
    
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
