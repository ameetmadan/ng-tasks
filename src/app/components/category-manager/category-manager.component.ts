import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { Category } from '../../store/categories/category.model';
import {
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectSelectedCategory
} from '../../store/categories/category.selectors';
import * as CategoryActions from '../../store/categories/category.actions';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { CategoryStatsComponent } from './category-stats/category-stats.component';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    CategoryFormComponent,
    CategoryListComponent,
    CategoryFilterComponent,
    CategoryStatsComponent
  ],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent implements OnInit {
  categories$: Observable<Category[]>;
  categoriesLoading$: Observable<boolean>;
  categoriesError$: Observable<string | null>;
  selectedCategory$: Observable<Category | null>;

  isFormVisible = false;
  editingCategory: Category | undefined;

  constructor(private store: Store<AppState>) {
    this.categories$ = this.store.select(selectAllCategories);
    this.categoriesLoading$ = this.store.select(selectCategoriesLoading);
    this.categoriesError$ = this.store.select(selectCategoriesError);
    this.selectedCategory$ = this.store.select(selectSelectedCategory);
  }

  ngOnInit(): void {
    this.store.dispatch(CategoryActions.loadCategories());
  }

  showAddForm(): void {
    this.editingCategory = undefined;
    this.isFormVisible = true;
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.editingCategory = undefined;
  }

  onAddCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.store.dispatch(CategoryActions.addCategory({ category }));
    this.hideForm();
  }

  onEditCategory(id: string): void {
    this.categories$.subscribe(categories => {
      this.editingCategory = categories.find(c => c.id === id);
      if (this.editingCategory) {
        this.isFormVisible = true;
      }
    }).unsubscribe();
  }

  onUpdateCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (this.editingCategory) {
      this.store.dispatch(CategoryActions.updateCategory({
        id: this.editingCategory.id,
        changes: category
      }));
      this.hideForm();
    }
  }

  onDeleteCategory(id: string): void {
    this.store.dispatch(CategoryActions.deleteCategory({ id }));
  }

  onSelectCategory(id: string): void {
    this.store.dispatch(CategoryActions.selectCategory({ id }));
  }

  onSaveCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (this.editingCategory) {
      this.onUpdateCategory(category);
    } else {
      this.onAddCategory(category);
    }
  }
}
