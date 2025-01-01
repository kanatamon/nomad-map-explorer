'use server';

import { cookies } from 'next/headers';
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

export async function getUserLocations() {
  return [
    {
      id: 1,
      username: 'Jane',
      lat: 18.1045953,
      lng: 100.1246671,
      updatedAt: new Date().getTime(),
      identifierColor: COLORS[0],
    },
    {
      id: 2,
      username: 'Sam',
      lat: 18.1088952,
      lng: 100.1246752,
      updatedAt: new Date().getTime(),
      identifierColor: COLORS[1],
    },
  ];
}

export async function getLoggedInUsername() {
  const cookieStore = await cookies();
  return cookieStore.get('username')?.value ?? null;
}

export async function updateLoggedInUsername(username: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // const username = formData.get('username');
  // invariant(
  //   typeof username === 'string' && username.trim() !== '',
  //   'Username is required'
  // );
  const cookieStore = await cookies();
  cookieStore.set('username', username, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  });
}
