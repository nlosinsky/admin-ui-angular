import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { DxServerModule } from 'devextreme-angular/server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), importProvidersFrom(DxServerModule)]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
