import { getTargetConfig } from '@env/api-config';

const config = getTargetConfig('development');

export const environment = {
  name: 'DEVELOPMENT',
  production: false,
  ...config.constructedConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
