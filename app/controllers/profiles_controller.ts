import Profile from '#models/profile'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiClient } from '@japa/api-client'
import ApiResponses from '../helpers/api_responses.js'

export default class ProfilesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params, response, request }: HttpContext) {
    try {
      const asUser = request.qs()['as_user_id'] //If tru then get profile by user id
      const withUser = request.qs()['with_user'] //If true then get profile wit user details

      const profile = await Profile.findBy(asUser ? 'user_id' : 'id', params.id)

      if (!profile) throw new Exception('This user profile was not found')

      if (withUser) await profile.load('user')
      return ApiResponses.success(response, profile, 'User profile retrieved succesfully')

    } catch (error) {
      return ApiResponses.badRequest(response, error.message)
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
