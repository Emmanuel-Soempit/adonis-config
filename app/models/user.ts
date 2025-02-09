import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Role from './role.js'
import { type HasOne, type ManyToMany } from '@adonisjs/lucid/types/relations'
import Profile from './profile.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string | null

  @column()
  declare last_name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ consume: (value) => Boolean(value) })
  declare email_verified: boolean

  @column.dateTime()
  declare email_verified_at: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare profile_id: number

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 days',
    prefix: 'crib_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 50,
  })

  // Relatonships
  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare public roles: ManyToMany<typeof Role>

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>
}
