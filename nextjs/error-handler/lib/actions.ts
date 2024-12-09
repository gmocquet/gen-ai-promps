'use server'

import { userSchema } from './schema';
import { PrismaClient } from '@prisma/client'
import { ServerActionResponse, createZodValidationError, createErrorResponse } from './types';

const prisma = new PrismaClient()

export async function submitUserData(formData: FormData): Promise<ServerActionResponse> {
  console.log('Received form data on server:', Object.fromEntries(formData))

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

export async function fetchUserData(): Promise<ServerActionResponse> {
  try {
    const users = await prisma.userInput.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to the last 10 entries
    });

    if (users.length === 0) {
      return createEmptyResultError('No user data found');
    }

    const rawData = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
      timeField: user.timeField.toISOString(),
    }));

    return {
      success: true,
      data: {
        rawData,
      },
    };
  } catch (error) {
    console.error(`[${error.name}] ${error.message}`);
    return createErrorResponse('DatabaseError', 'Failed to fetch user data. Please try again.');
  } finally {
    await prisma.$disconnect();
  }
}

