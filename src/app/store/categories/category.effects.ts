import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { CategoryApiService } from '../../services/category-api.service';
import * as CategoryActions from './category.actions';

@Injectable()
export class CategoryEffects {

  // Load categories from API
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      exhaustMap(() =>
        this.categoryApiService.getCategories().pipe(
          map(categories => CategoryActions.loadCategoriesSuccess({ categories })),
          catchError(error => of(CategoryActions.loadCategoriesFailure({
            error: error.message
          })))
        )
      )
    )
  );

  // Add category with optimistic update
  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategory),
      exhaustMap(({ category }) =>
        this.categoryApiService.createCategory(category).pipe(
          map(createdCategory =>
            CategoryActions.addCategorySuccess({ category: createdCategory })
          ),
          catchError(error => of(CategoryActions.addCategoryFailure({
            error: error.message
          })))
        )
      )
    )
  );

  // Update category
  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.updateCategory),
      exhaustMap(({ id, changes }) =>
        this.categoryApiService.updateCategory(id, changes).pipe(
          map(updatedCategory =>
            CategoryActions.updateCategorySuccess({ category: updatedCategory })
          ),
          catchError(error => of(CategoryActions.updateCategoryFailure({
            error: error.message
          })))
        )
      )
    )
  );

  // Delete category
  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      exhaustMap(({ id }) =>
        this.categoryApiService.deleteCategory(id).pipe(
          map(() => CategoryActions.deleteCategorySuccess({ id })),
          catchError(error => of(CategoryActions.deleteCategoryFailure({
            error: error.message
          })))
        )
      )
    )
  );

  // Success notification effect (non-dispatching)
  categorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CategoryActions.addCategorySuccess,
        CategoryActions.updateCategorySuccess,
        CategoryActions.deleteCategorySuccess
      ),
      tap((action) => {
        console.log('Category operation successful:', action.type);
      })
    ),
    { dispatch: false }
  );

  // Error notification effect (non-dispatching)
  categoryError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CategoryActions.loadCategoriesFailure,
        CategoryActions.addCategoryFailure,
        CategoryActions.updateCategoryFailure,
        CategoryActions.deleteCategoryFailure
      ),
      tap(({ error }) => {
        console.error('Category operation failed:', error);
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private categoryApiService: CategoryApiService
  ) {}
}
