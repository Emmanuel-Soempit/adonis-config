import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/types/bodyparser'
import drive from '@adonisjs/drive/services/main'

export class StorageService {
  // Your code here

  static async storeFile(file: MultipartFile, storagePath: string) {
    
    const key = `${storagePath}/${cuid()}.${file.extname}`
    await file.moveToDisk(key)

    return `uploads/${key}`
  }

  static async deleteFile(filePath: string) {
    const newPath =filePath. replace(/^uploads\//, "")
    console.log(newPath)
    console.log(filePath)
    return await drive.use().delete(newPath)
  }
}
