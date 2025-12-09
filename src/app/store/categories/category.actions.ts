import { createAction, props } from '@ngrx/store';
import { Category } from './category.model';

// Load Categories
export const loadCategories = createAction('[Category] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Category] Load Categories Success',
  props<{ categories: Category[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Category] Load Categories Failure',
  props<{ error: string }>()
);

// Add Category
export const addCategory = createAction(
  '[Category] Add Category',
  props<{ category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> }>()
);

export const addCategorySuccess = createAction(
  '[Category] Add Category Success',
  props<{ category: Category }>()
);

export const addCategoryFailure = createAction(
  '[Category] Add Category Failure',
  props<{ error: string }>()
);

// Update Category
export const updateCategory = createAction(
  '[Category] Update Category',
  props<{ id: string; changes: Partial<Category> }>()
);

export const updateCategorySuccess = createAction(
  '[Category] Update Category Success',
  props<{ category: Category }>()
);

export const updateCategoryFailure = createAction(
  '[Category] Update Category Failure',
  props<{ error: string }>()
);

// Delete Category
export const deleteCategory = createAction(
  '[Category] Delete Category',
  props<{ id: string }>()
);

export const deleteCategorySuccess = createAction(
  '[Category] Delete Category Success',
  props<{ id: string }>()
);

export const deleteCategoryFailure = createAction(
  '[Category] Delete Category Failure',
  props<{ error: string }>()
);

// Selection Actions
export const selectCategory = createAction(
  '[Category] Select Category',
  props<{ id: string | null }>()
);

// Filter Actions
export const setFilterCategories = createAction(
  '[Category] Set Filter Categories',
  props<{ categoryIds: string[] }>()
);

export const clearFilterCategories = createAction(
  '[Category] Clear Filter Categories'
);

// Task-Category Association Actions
export const assignCategoriesToTask = createAction(
  '[Category] Assign Categories To Task',
  props<{ taskId: string; categoryIds: string[] }>()
);

export const assignCategoriesToTaskSuccess = createAction(
  '[Category] Assign Categories To Task Success',
  props<{ taskId: string; categoryIds: string[] }>()
);
