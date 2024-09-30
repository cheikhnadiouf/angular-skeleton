import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TodoComponent } from './components/todo/todo.component';
import { TodoStoreComponent } from './store/todo-store/todo-store.component';

@NgModule({
  declarations: [TodoComponent, TodoStoreComponent],
  imports: [
    CommonModule,
    SharedModule.forRoot(), // Share components and unique instance of a service beetween modules
  ],
  exports: [TodoComponent, TodoStoreComponent],
})
export class TodosModule {}
