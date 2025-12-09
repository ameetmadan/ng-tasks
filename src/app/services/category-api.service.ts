import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { Category } from '../store/categories/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {
  private mockCategories: Category[] = [
    {
      id: '1',
      name: 'Work',
      description: 'Work-related tasks and projects',
      color: '#3b82f6',
      icon: 'briefcase',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Personal',
      description: 'Personal tasks and errands',
      color: '#10b981',
      icon: 'user',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '3',
      name: 'Shopping',
      description: 'Shopping list and purchases',
      color: '#f59e0b',
      icon: 'shopping-cart',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '4',
      name: 'Learning',
      description: 'Educational goals and courses',
      color: '#8b5cf6',
      icon: 'book',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    }
  ];

  // Simulate network delay
  private simulateDelay<T>(data: T, delayMs = 500): Observable<T> {
    return of(data).pipe(
      delay(delayMs),
      // Simulate random failures (10% chance)
      switchMap(d => Math.random() < 0.1
        ? throwError(() => new Error('Network error: Unable to connect to server'))
        : of(d)
      )
    );
  }

  getCategories(): Observable<Category[]> {
    return this.simulateDelay([...this.mockCategories]);
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    const category = this.mockCategories.find(c => c.id === id);
    return this.simulateDelay(category);
  }

  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Observable<Category> {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockCategories.push(newCategory);
    return this.simulateDelay(newCategory);
  }

  updateCategory(id: string, changes: Partial<Category>): Observable<Category> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Category not found'));
    }

    this.mockCategories[index] = {
      ...this.mockCategories[index],
      ...changes,
      updatedAt: new Date()
    };

    return this.simulateDelay(this.mockCategories[index]);
  }

  deleteCategory(id: string): Observable<void> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Category not found'));
    }

    this.mockCategories = this.mockCategories.filter(c => c.id !== id);
    return this.simulateDelay(undefined as void);
  }

  checkDuplicateCategoryName(name: string, excludeId?: string): Observable<boolean> {
    const exists = this.mockCategories.some(
      c => c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
    );
    return this.simulateDelay(exists, 300);
  }
}
