import { ApplicationConfig, importProvidersFrom, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { serverRoutes } from '@app/app.routes.server';
import { DxServerModule } from 'devextreme-angular/server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), importProvidersFrom(DxServerModule), provideServerRouting(serverRoutes)]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
