import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { TodosBackendLessInterceptor } from './todos/mocks/todos-fake.backend';
import { environment } from '../environments/environment';
// import { PagesModule } from './pages/pages.module';

const commonProviders = [
  provideAnimationsAsync(),
  provideHttpClient(),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
];

const nonProductionProviders = [
  provideHttpClient(withInterceptorsFromDi()),
  // withInterceptorsFromDi() function add interceptors that are registered in the old format (Class-based)
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TodosBackendLessInterceptor,
    multi: true,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedModule.forRoot(), // Share components and unique instance of a service beetween modules
    // PagesModule,
    AppRoutingModule, // MUST COME LAST AFTER ROUTED MODULES RESOURCES:
    // The order of route configuration is important because the router accepts the first route that matches a navigation request path
  ],
  providers: [
    ...commonProviders,
    // Add below provider used to create fake backend in place of Http service for backend-less development
    // Edit the line below if you need to replace it with the real remote backend
    ...(!environment.production ? nonProductionProviders : []),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
