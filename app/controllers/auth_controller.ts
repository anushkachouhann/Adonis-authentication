import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'
import authService from '#services/auth_service'

export default class AuthController {
  async register({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    if (await authService.emailExists(data.email)) {
      return response.conflict({
        success: false,
        message: 'Email already registered',
      })
    }

    const user = await authService.register(data)

    // Log in the user after registration (creates session)
    await auth.use('web').login(user)

    return response.created({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  }

  async login({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(loginValidator)

    try {
      const user = await authService.login(data)

      // Create session for the user
      await auth.use('web').login(user)

      return response.ok({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      })
    } catch {
      return response.unauthorized({
        success: false,
        message: 'Invalid credentials',
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.ok({
      success: true,
      message: 'Logged out successfully',
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user!

    return response.ok({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  }
}
