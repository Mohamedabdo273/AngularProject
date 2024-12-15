import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Import withFetch

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),        // Configuring the router
    provideHttpClient(withFetch()) // Enabling fetch API for HttpClient
  ],
});
