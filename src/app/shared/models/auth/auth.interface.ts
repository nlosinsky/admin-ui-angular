export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Token {
  accessToken: string;
  accessTokenExpiresAt: string;
  scope: string;
  client: {
    id: string;
  };
  user: {
    id: string;
    companyId: string;
  };
  access_token: string;
}
