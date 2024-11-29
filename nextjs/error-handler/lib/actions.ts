'use server'

import { userSchema } from './schema';
import { PrismaClient } from '@prisma/client'
import { ServerActionResponse, createZodValidationError, createErrorResponse } from './types';

const prisma = new PrismaClient()

export async function submitUserData(prevState: any, formData: FormData): Promise<ServerActionResponse> {
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
      error: createZodValidationError(validatedFields.error),
    };
  }

  try {
    const { age, ...restData } = validatedFields.data;
    const userData = {
      ...restData,
      age: age ?? null,
    };

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
      data: {
        createdAt: createdUser.createdAt.toISOString(),
        timeField: createdUser.timeField.toISOString(),
      }
    };
  } catch (error) {
    console.error(`[${error.name}] ${error.message}`);

    if (error.code === 'P2002' && error.meta?.target?.includes('timeField')) {
      return createErrorResponse('DatabaseError', 'An entry has already been made this minute. Please try again in the next minute.');
    }

    return createErrorResponse('UnknownError', 'Failed to store data. Please try again.');
  } finally {
    await prisma.$disconnect();
  }
}

