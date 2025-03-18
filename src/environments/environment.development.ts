import { getTargetConfig } from '@env/api-config';

const config = getTargetConfig('development');

export const environment = {
  name: 'DEVELOPMENT',
  production: true,
  ...config.constructedConfig
};
