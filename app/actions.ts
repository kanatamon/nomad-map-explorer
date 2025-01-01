'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import invariant from 'tiny-invariant';
// import invariant from 'tiny-invariant';

const COLORS = [
  '#d53e4f',
  '#fc8d59',
  '#fee08b',
  '#ffffbf',
  '#e6f598',
  '#99d594',
  '#3288bd',
];

const EXPIRED_USER_LOCATION_THRESHOLD = 1000 * 60 * 3; // 3 minutes

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
  const nextColorIndex = COLORS.indexOf(
    latestUserLocation?.colorIdentifier ?? COLORS[0]
  );
  const nextColor = COLORS[(nextColorIndex + 1) % COLORS.length];
  return await prisma.userLocation.create({
    data: {
      name: username,
      ...location,
      colorIdentifier: nextColor,
    },
  });
}
