import vine, { SimpleMessagesProvider } from '@vinejs/vine'

//Registration Validation Rule
export const registerUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim(),
    last_name: vine.string().trim(),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().trim().minLength(8),
    bio: vine.string().optional(),
    phone: vine.string().trim().minLength(11).optional(),
    profile_image: vine
      .file({
        extnames: ['jpg', 'png', 'jpeg'], // Allowed file extensions
        size: '2mb', // Max file size
      })
      .optional(),
    role_id: vine.number(),
  })
)

registerUserValidator.messagesProvider = new SimpleMessagesProvider(
  {
    'required': 'The {{ field }} field is required',
    'email.email': 'A valid email address is required',
    'password.minLength': 'Password must be at least 8 characters long',
    'phone_number.required': 'A valid mobile number is required',
    'profile_image.extname': 'Only JPG, PNG, and JPEG file formats are allowed',
    'profile_image.size': 'Maximum file size of 2mb',
  },
  {
    first_name: 'first name',
    last_name: 'first name',
    role_id: 'role id',
    email: 'Email',
    password: 'Password',
    profile_image: 'Profile Image',
  }
)

//Login Validation Rules
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8),
  })
)

loginUserValidator.messagesProvider = new SimpleMessagesProvider(
  {
    'required': 'The {{ field }} field is required',
    'email.email': 'A valid email address is required',
    'password.minLength': 'Password must be at least 8 characters long',
  },
  {
    email: 'Email',
    password: 'Password',
  }
)

export const updateUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim().optional(),
    last_name: vine.string().trim().optional(),
    bio: vine.string().optional().optional(),
    phone: vine.string().trim().minLength(11).optional(),
    profile_image: vine
      .file({
        extnames: ['jpg', 'png', 'jpeg'], // Allowed file extensions
        size: '2mb', // Max file size
      })
      .optional(),
    // role_id: vine.number().optional(),
  })
)

updateUserValidator.messagesProvider = new SimpleMessagesProvider(
  {
    'phone_number.required': 'A valid mobile number is required',
    'profile_image.extname': 'Only JPG, PNG, and JPEG file formats are allowed',
    'profile_image.size': 'Maximum file size of 2mb',
  },
  {
    first_name: 'first name',
    last_name: 'first name',
    // role_id: 'role id',
    profile_image: 'Profile Image',
  }
)
