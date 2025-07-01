import { ApplicationConfig, importProvidersFrom, mergeApplicationConfig } from '@angular/core';
import { serverRoutes } from '@app/app.routes.server';
import { DxServerModule } from 'devextreme-angular/server';
import { appConfig } from './app.config';
import { provideServerRendering, withRoutes } from '@angular/ssr';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes)), importProvidersFrom(DxServerModule)]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
