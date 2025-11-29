'use server';

import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

export async function syncUser(): Promise<User | null> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return null;
  }

  const existingUser = await db.user.findUnique({
    where: { id: clerkUser.id },
  });

  if (existingUser) {
    // Update info if changed
    if (existingUser.username !== clerkUser.username && clerkUser.username) {
        return await db.user.update({
            where: { id: clerkUser.id },
            data: { username: clerkUser.username || clerkUser.firstName }
        });
    }
    return existingUser;
  }

  // Create new user
  // Logic to make the first user admin or specific email
  // For now, we will manually set admin in DB or use a specific logic if requested.
  // The user said "soy yo el super admin", so we might want to make him admin if he is the first one or by email.
  
  const isFirstUser = (await db.user.count()) === 0;

  const newUser = await db.user.create({
    data: {
      id: clerkUser.id,
      email: email,
      username: clerkUser.username || clerkUser.firstName || 'Usuario',
      avatarUrl: clerkUser.imageUrl,
      isAdmin: isFirstUser, // First user is admin
    },
  });

  return newUser;
}

export async function getUser(userId: string) {
    return await db.user.findUnique({
        where: { id: userId }
    });
}
