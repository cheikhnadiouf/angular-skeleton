import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TodoComponent } from './todo/todo.component';


@NgModule({
  declarations: [
    TodoComponent
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(), // Share components and unique instance of a service beetween modules
  ],
  exports: [
    TodoComponent
  ]
})
export class TodosModule { }
