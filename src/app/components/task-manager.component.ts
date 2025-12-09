import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService, Task } from '../services/task.service';
import { TaskValidators } from '../validators/task.validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  tasks$!: Observable<Task[]>;
  activeTasks$!: Observable<Task[]>;
  completedTasks$!: Observable<Task[]>;
  taskStats$!: Observable<{ total: number; completed: number; active: number }>;

  showCompleted = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          TaskValidators.noSpecialCharsAtStart()
        ],
        [TaskValidators.duplicateTitle(this.taskService)]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          TaskValidators.minWordCount(3)
        ]
      ],
      priority: ['medium', Validators.required]
    });
  }

  private initObservables(): void {
    this.tasks$ = this.taskService.getTasks();
    this.activeTasks$ = this.taskService.getActiveTasks();
    this.completedTasks$ = this.taskService.getCompletedTasks();
    this.taskStats$ = this.taskService.getTaskStats();
  }

  get titleControl() {
    return this.taskForm.get('title');
  }

  get descriptionControl() {
    return this.taskForm.get('description');
  }

  get priorityControl() {
    return this.taskForm.get('priority');
  }

  getTitleError(): string {
    const control = this.titleControl;
    if (control?.hasError('required')) {
      return 'Title is required';
    }
    if (control?.hasError('minlength')) {
      return 'Title must be at least 3 characters';
    }
    if (control?.hasError('maxlength')) {
      return 'Title must not exceed 100 characters';
    }
    if (control?.hasError('specialCharsAtStart')) {
      return 'Title cannot start with special characters';
    }
    if (control?.hasError('duplicateTitle')) {
      return 'This task title already exists in active tasks';
    }
    return '';
  }

  getDescriptionError(): string {
    const control = this.descriptionControl;
    if (control?.hasError('required')) {
      return 'Description is required';
    }
    if (control?.hasError('minlength')) {
      return 'Description must be at least 10 characters';
    }
    if (control?.hasError('minWordCount')) {
      const error = control.getError('minWordCount');
      return `Description must have at least ${error.required} words (current: ${error.actual})`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.addTask({
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        priority: this.taskForm.value.priority,
        completed: false
      });
      this.taskForm.reset({ priority: 'medium' });
    }
  }

  toggleTask(taskId: string): void {
    this.taskService.toggleTaskCompletion(taskId);
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  toggleCompletedVisibility(): void {
    this.showCompleted = !this.showCompleted;
  }
}
