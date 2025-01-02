'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import invariant from 'tiny-invariant';

const COLORS = [
  '#f72585',
  '#b5179e',
  '#7209b7',
  '#560bad',
  '#480ca8',
  '#3a0ca3',
  '#3f37c9',
  '#4361ee',
  '#4895ef',
  '#5f0f40',
  '#9a031e',
  '#0f4c5c',
];

const EXPIRED_USER_LOCATION_THRESHOLD = 1000 * 60 * 5; // 5 minutes

export async function getUserLocations() {
  const userLocations = await prisma.userLocation.findMany();
  const expiredUserLocations = userLocations.filter(
    (userLocation) =>
      Date.now() - userLocation.updatedAt.getTime() >
      EXPIRED_USER_LOCATION_THRESHOLD
  );
  if (expiredUserLocations.length) {
    await prisma.userLocation.deleteMany({
      where: {
        id: { in: expiredUserLocations.map((userLocation) => userLocation.id) },
      },
    });
  }
  return userLocations.filter(
    (userLocation) =>
      Date.now() - userLocation.updatedAt.getTime() <=
      EXPIRED_USER_LOCATION_THRESHOLD
  );
}

export async function getLoggedInUsername() {
  const cookieStore = await cookies();
  return cookieStore.get('username')?.value ?? null;
}

export async function saveLoggedInUsername(username: string) {
  const existingLocation = await prisma.userLocation.findFirst({
    where: { name: username },
  });
  if (existingLocation) {
    throw new Error('ผู้ใช้นี้มีอยู่แล้ว กรุณาเลือกชื่ออื่น หรือ รอ 3 นาที');
  }
  const cookieStore = await cookies();
  cookieStore.set('username', username, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
}

export async function upsertUserLocation(location: {
  latitude: number;
  longitude: number;
}) {
  console.log('upsertUserLocation', location);
  const username = await getLoggedInUsername();
  invariant(username, 'No logged in user');

  const existingLocation = await prisma.userLocation.findFirst({
    where: { name: username },
  });

  if (existingLocation) {
    return await prisma.userLocation.update({
      where: { id: existingLocation.id },
      data: location,
    });
  }

  const latestUserLocation = await prisma.userLocation.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  const latestColorIndex = latestUserLocation?.colorIdentifier
    ? COLORS.indexOf(latestUserLocation?.colorIdentifier)
    : COLORS.length - 1;
  const nextColor = COLORS[(latestColorIndex + 1) % COLORS.length];
  return await prisma.userLocation.create({
    data: {
      name: username,
      ...location,
      colorIdentifier: nextColor,
    },
  });
}
