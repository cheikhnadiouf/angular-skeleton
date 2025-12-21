import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { TodoComponent } from './components/todo/todo.component';

@NgModule({
  declarations: [TodoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule.forRoot(), // Share components and unique instance of a service beetween modules
  ],
  exports: [TodoComponent],
})
export class TodosModule {}
