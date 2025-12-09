import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagerComponent } from '../task-manager.component';
import { CategoryManagerComponent } from '../category-manager/category-manager.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, TaskManagerComponent, CategoryManagerComponent],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent {
  activeTab: 'tasks' | 'categories' = 'tasks';

  switchTab(tab: 'tasks' | 'categories'): void {
    this.activeTab = tab;
  }
}
