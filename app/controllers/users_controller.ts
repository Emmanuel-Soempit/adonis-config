import User from '#models/user'
import { loginUserValidator, registerUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import ApiResponses from '../helpers/api_responses.js'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Role from '#models/role'
import Utils from '../helpers/utils.js'
import Profile from '#models/profile'
import { Exception } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import { StorageService } from '#services/storage_service'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerUserValidator)
    try {
      await db.transaction(async (client) => {
        const role = await Role.findBy('id', payload.role_id)
        if (!role) throw new Error('Role not found')

        const user = await User.create(
          {
            ...Utils.omit(payload, ['role_id', 'bio', 'profile_image', 'phone']),
            email_verified: true,
            email_verified_at: DateTime.now(),
          },
          { client }
        )

        //append user and roles relationship, then load
        await user.related('roles').attach([role!.id])
        await user.load('roles')

        let key = null
        //save image if give and update profile_url to collect the image path
        if (payload.profile_image) {
          key = await StorageService.storeFile(payload.profile_image, 'profile_images')
          // await payload.profile_image?.move('public/uploads/profile_images')
          // profile_url = `uploads/profile_images/${payload.profile_image.fileName}`
        }

        await user.related('profile').create(
          {
            profile_image: key,
            ...Utils.pick(payload, ['bio', 'phone']),
          },
          { client }
        )

        await user.load('profile')

        return ApiResponses.created(response, user, 'User created succesfully')
      })
    } catch (error) {
      return ApiResponses.error(response, 'Could not create user', 500, error.message)
    }
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginUserValidator)
    console.log(payload)

    try {
      const user = await User.verifyCredentials(payload.email, payload.password)

      await user.load('roles')

      const token = await User.accessTokens.create(user)

      return ApiResponses.created(response, { user, token }, 'Login Successful')
    } catch (error) {
      const statuscode = error.message.includes('Invalid user credentials') ? 401 : 500
      return ApiResponses.error(response, 'Login unsuccessful', statuscode, error.message)
    }
  }

  async update({ request, response, params }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)

    try {
      // const role = await Role.findBy('id', payload.role_id)
      // if (!role) throw new Error('Role not found')

      const user = await User.findBy('id', params.id)

      if (!user) throw new Exception('User was not found')

      await user.merge({
        ...Utils.omit(payload, ['bio', 'profile_image', 'phone']),
      })

      await user.load('profile')

      //append user and roles relationship, then load
      // await user.related('roles').attach([role!.id])
      // await user.load('roles')

      let key = null
      //save image if give and update profile_url to collect the image path

      if (payload.profile_image) {
        if (user.profile.profile_image) {
          console.log(user.profile.profile_image)
          await StorageService.deleteFile(user.profile.profile_image)
        }
        key = await StorageService.storeFile(payload.profile_image, 'profile_images')
        // await payload.profile_image?.move('public/uploads/profile_images')
        // profile_url = `uploads/profile_images/${payload.profile_image.fileName}`
      }

      //create profile under user and load it
      user.profile.merge({ profile_image: key, ...Utils.pick(payload, ['bio', 'phone']) })
      await user.profile.save()
      await user.save()

      return ApiResponses.created(response, user, 'User created succesfully')
    } catch (error) {
      return ApiResponses.error(response, 'Could not create user', 500, error.message)
    }
  }
}
