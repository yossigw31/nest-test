export const jwtConstants = {
  ACCESS_TOKEN_SECRET: 'supercalifragilisticexpialidocious',
  ACCESS_TOKEN_EXPIRATION_TIME: '1m',
  REFRESH_TOKEN_SECRET: 'aintnobodygottimeforthat',
  REFRESH_TOKEN_EXPIRATION_TIME: '5h',
};
// EXPIRATION_TIME - default is ms number
// optional string units - m / h / d
// `ms` by vercel is used under the hood so any of its formats will work
// full list of string examples - https://github.com/vercel/ms#examples
