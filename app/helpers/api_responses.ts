import type { Response } from '@adonisjs/core/http'

export default class ApiResponses {
  static success(response: Response, data: any = null, message = 'Success', status = 200) {
    return response.status(status).json({
      success: true,
      message,
      data,
    })
  }

  static error(
    response: Response,
    message = 'An error occurred',
    status = 500,
    errors: any = null
  ) {
    return response.status(status).send({
      success: false,
      message,
      errors,
    })
  }

  static notFound(response: Response, message = 'Resource not found') {
    return this.error(response, message, 404)
  }

  static unauthorized(response: Response, message = 'Unauthorized') {
    return this.error(response, message, 401)
  }

  static forbidden(response: Response, message = 'Forbidden') {
    return this.error(response, message, 403)
  }

  static badRequest(response: Response, message = 'Bad Request', errors: any = null) {
    return this.error(response, message, 400, errors)
  }

  static conflict(response: Response, message = 'Conflict detected') {
    return this.error(response, message, 409)
  }

  static validationError(response: Response, errors: any) {
    return this.error(response, 'Validation failed', 422, errors)
  }

  static created(response: Response, data: any, message = 'Resource created successfully') {
    return this.success(response, data, message, 201)
  }

  static noContent(response: Response) {
    return response.status(204).json({
      success: true,
      message: 'No Content',
    })
  }
}
