/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ProfilesController from '#controllers/profiles_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

router.post('register', [UsersController, 'index'])
router.post('login', [UsersController, 'login'])

//
router.resource('profile', ProfilesController).use(['show'], [middleware.auth()]).except(['update'])

router.put('profile/:id', [UsersController, 'update']).use([middleware.auth()]) 
