import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TaskManagerComponent } from './app/components/task-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskManagerComponent],
  template: `<app-task-manager></app-task-manager>`,
})
export class App {}

bootstrapApplication(App);
