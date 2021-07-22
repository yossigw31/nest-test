
export interface JwtPayload {
  id: string;
}

export interface TokenCookie {
  cookie: string;
  token: string;
}

export interface UserTokens {
  accessTokenCookie: TokenCookie;
  refreshTokenCookie: TokenCookie;
}
