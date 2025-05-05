/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('L\'application a démarré avec succès.');
  })
  .catch((err: any) => {
    console.error('Erreur lors du démarrage de l\'application:', err);
  });
