import { getTargetConfig } from '@env/api-config';

const config = getTargetConfig('production');

export const environment = {
  name: 'PRODUCTION',
  production: true,
  ...config.constructedConfig
};
