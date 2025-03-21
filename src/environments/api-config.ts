export const apiConfig = {
  production: {
    auth_api: '',
    admin_api: ''
  },
  demo: {
    auth_api: '',
    admin_api: ''
  },
  development: {
    auth_api: '',
    admin_api: 'http://localhost:3000'
  }
};

interface Config {
  auth_api: string;
  admin_api: string;
  constructedConfig: ConstructedConfig;
}
interface ConstructedConfig {
  baseAuthUrl: string;
  baseAdminUrl: string;
}

export const getTargetConfig = (env: keyof typeof apiConfig): Config => {
  const config = apiConfig[env];
  return {
    ...config,

    get constructedConfig() {
      const authApiHost = config.auth_api;
      const adminApiHost = config.admin_api;

      return {
        get baseAuthUrl(): string {
          return authApiHost;
        },
        get baseAdminUrl(): string {
          return adminApiHost;
        }
      };
    }
  };
};
