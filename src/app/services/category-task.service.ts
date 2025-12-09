import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TaskService, Task } from './task.service';
import { TaskCategoryAssociation } from '../store/categories/category.model';
import { AppState } from '../store/app.state';
import * as CategoryActions from '../store/categories/category.actions';

@Injectable({
  providedIn: 'root'
})
export class CategoryTaskService {
  private taskCategoryAssociations = new BehaviorSubject<TaskCategoryAssociation[]>([]);
  public taskCategoryAssociations$ = this.taskCategoryAssociations.asObservable();

  constructor(
    private taskService: TaskService,
    private store: Store<AppState>
  ) {}

  assignCategoriesToTask(taskId: string, categoryIds: string[]): void {
    const current = this.taskCategoryAssociations.value;
    const existing = current.find(a => a.taskId === taskId);

    if (existing) {
      existing.categoryIds = categoryIds;
      this.taskCategoryAssociations.next([...current]);
    } else {
      this.taskCategoryAssociations.next([...current, { taskId, categoryIds }]);
    }

    // Also dispatch to store
    this.store.dispatch(
      CategoryActions.assignCategoriesToTaskSuccess({ taskId, categoryIds })
    );
  }

  getCategoriesForTask(taskId: string): Observable<string[]> {
    return this.taskCategoryAssociations$.pipe(
      map(associations => {
        const association = associations.find(a => a.taskId === taskId);
        return association ? association.categoryIds : [];
      })
    );
  }

  getTasksForCategory(categoryId: string): Observable<Task[]> {
    return combineLatest([
      this.taskService.getTasks(),
      this.taskCategoryAssociations$
    ]).pipe(
      map(([tasks, associations]) => {
        const taskIds = associations
          .filter(a => a.categoryIds.includes(categoryId))
          .map(a => a.taskId);
        return tasks.filter(t => taskIds.includes(t.id));
      })
    );
  }

  getTaskCountByCategory(categoryId: string): Observable<number> {
    return this.getTasksForCategory(categoryId).pipe(
      map(tasks => tasks.length)
    );
  }

  getFilteredTasks(categoryIds: string[]): Observable<Task[]> {
    if (categoryIds.length === 0) {
      return this.taskService.getTasks();
    }

    return combineLatest([
      this.taskService.getTasks(),
      this.taskCategoryAssociations$
    ]).pipe(
      map(([tasks, associations]) => {
        const taskIds = associations
          .filter(a => a.categoryIds.some(catId => categoryIds.includes(catId)))
          .map(a => a.taskId);
        return tasks.filter(t => taskIds.includes(t.id));
      })
    );
  }
}
