import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import ApiResponses from '../helpers/api_responses.js'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: string[]) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = await auth.createAuthenticator(ctx).authenticate()
    await user.load('roles')

    //check if any of the user roles are allowed roles
    const roleData = allowedRoles.filter((current) => {
      const role = user.roles.find((currentRole) => current === currentRole.$attributes.name)
      return role ? true : false
    })

    //If not the return and unaruthorised error
    if (roleData.length <= 0) {
      return ApiResponses.unauthorized(ctx.response, 'You do not have rights to this action')
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
