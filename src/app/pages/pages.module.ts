import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { NgrxComponent } from './ngrx/ngrx.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TodosModule } from '../todos/todos.module';

@NgModule({
  declarations: [HomeComponent, NgrxComponent, NotFoundComponent],
  imports: [
    CommonModule,
    SharedModule.forRoot(), // Share components and unique instance of a service beetween modules
    TodosModule,
    PagesRoutingModule, // MUST COME LAST AFTER ROUTED MODULES RESOURCES:
    // The order of route configuration is important because the router accepts the first route that matches a navigation request path
  ],
})
export class PagesModule {}
