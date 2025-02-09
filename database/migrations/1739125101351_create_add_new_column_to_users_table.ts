import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_new_column_to_users'

  async up() {
    this.schema.alterTable('users', (table) => {
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('cascade')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
