import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      { name: 'admin', description: 'General Admin with all privileges' },
      { name: 'owner', description: 'Owner privileges with specific reads and writes' },
      { name: 'user', description: 'User priviledged with specific reads and writes' },
    ])
  }
}
