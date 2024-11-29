'use server'

import { userSchema } from './schema';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function submitUserData(prevState: any, formData: FormData) {
  console.log('Received form data on server:', Object.fromEntries(formData));

  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    age: formData.get('age') ? parseInt(formData.get('age') as string, 10) : undefined,
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  try {
    const { age, ...restData } = validatedFields.data;
    const userData = {
      ...restData,
      age: age ?? null,
    };

    // Create a Date object for the current time and round down to the nearest minute
    const now = new Date();
    now.setSeconds(0, 0);

    const createdUser = await prisma.userInput.create({
      data: {
        ...userData,
        timeField: now,
      },
    });

    return { 
      success: true, 
      createdAt: createdUser.createdAt.toISOString(),
      timeField: createdUser.timeField.toISOString(),
    };
  } catch (error) {
    if (!error) {
      return { success: false, errors: { server: 'Unknow error' }}
    }      
    
    console.error(`[${error.name}] ${error.message}`)

    console.log("---------")

    if (error.code === 'P2002' && error.meta?.target?.includes('timeField')) {
      return {
        success: false,
        errors: { server: 'An entry has already been made this minute. Please try again in the next minute.' },
      };
    }
    return {
      success: false,
      errors: { server: 'Failed to store data. Please try again.' },
    };
  } finally {
    await prisma.$disconnect();
  }
}