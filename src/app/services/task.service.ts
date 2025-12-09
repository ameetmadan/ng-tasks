import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  categoryIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    this.loadInitialTasks();
  }

  private loadInitialTasks(): void {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Learn Angular Signals',
        description: 'Explore the new reactive primitive in Angular',
        priority: 'high',
        completed: false,
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Master RxJS Operators',
        description: 'Deep dive into common RxJS patterns',
        priority: 'medium',
        completed: true,
        createdAt: new Date()
      }
    ];
    this.tasksSubject.next(sampleTasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  getActiveTasks(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => !task.completed))
    );
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.completed))
    );
  }

  getTaskStats(): Observable<{ total: number; completed: number; active: number }> {
    return this.tasks$.pipe(
      map(tasks => ({
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        active: tasks.filter(t => !t.completed).length
      }))
    );
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const currentTasks = this.tasksSubject.value;
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.tasksSubject.next([...currentTasks, newTask]);
  }

  toggleTaskCompletion(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.tasksSubject.next(updatedTasks);
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasks);
  }

  checkDuplicateTitle(title: string): Observable<boolean> {
    return this.tasks$.pipe(
      map(tasks => tasks.some(task =>
        task.title.toLowerCase() === title.toLowerCase() && !task.completed
      ))
    );
  }
}
