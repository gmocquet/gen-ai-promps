'use server'

import { userSchema, UserFormData } from '@/schemas/userSchema'

export async function submitUserForm(prevState: any, formData: FormData) {
  console.log('Server received form data:', Object.fromEntries(formData))

  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    age: Number(formData.get('age')),
    isSubscribed: formData.get('isSubscribed') === 'true',
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data

  try {
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Server processed data:', data)

    // Return success response
    return {
      success: true,
      message: 'Form submitted successfully!',
    }
  } catch (error) {
    console.error('Server error:', error)
    return {
      success: false,
      message: 'An error occurred while processing your request.',
    }
  }
}

