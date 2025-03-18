import { getTargetConfig } from '@env/api-config';

const config = getTargetConfig('demo');

export const environment = {
  name: 'DEMO',
  production: true,
  ...config.constructedConfig
};
