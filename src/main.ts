import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';

import { appConfig } from './app/app.config';
import { enableProfiling } from '@angular/core';

enableProfiling();
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
