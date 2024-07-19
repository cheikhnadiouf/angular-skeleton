import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NgrxComponent } from './ngrx/ngrx.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'pages/home', pathMatch: 'full' },
  { path: 'pages', redirectTo: 'pages/home', pathMatch: 'full' },
  { path: 'pages/home', component: HomeComponent },
  { path: 'pages/ngrx', component: NgrxComponent },
  { path: 'pages/notfound', component: NotFoundComponent },
  // otherwise redirect to page not found
  { path: 'pages/**', redirectTo: 'pages/notfound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
