import { createReducer, on } from '@ngrx/store';
import { CategoryState, initialCategoryState } from './category.state';
import * as CategoryActions from './category.actions';

export const categoryReducer = createReducer(
  initialCategoryState,

  // Load Categories
  on(CategoryActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => {
    const entities = categories.reduce((acc, category) => ({
      ...acc,
      [category.id]: category
    }), {} as { [id: string]: typeof categories[0] });
    const ids = categories.map(c => c.id);

    return {
      ...state,
      entities,
      ids,
      loading: false,
      lastUpdated: new Date()
    };
  }),

  on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add Category
  on(CategoryActions.addCategory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CategoryActions.addCategorySuccess, (state, { category }) => ({
    ...state,
    entities: {
      ...state.entities,
      [category.id]: category
    },
    ids: [...state.ids, category.id],
    loading: false,
    lastUpdated: new Date()
  })),

  on(CategoryActions.addCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Category
  on(CategoryActions.updateCategory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CategoryActions.updateCategorySuccess, (state, { category }) => ({
    ...state,
    entities: {
      ...state.entities,
      [category.id]: category
    },
    loading: false,
    lastUpdated: new Date()
  })),

  on(CategoryActions.updateCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Category
  on(CategoryActions.deleteCategory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CategoryActions.deleteCategorySuccess, (state, { id }) => {
    const { [id]: removed, ...entities } = state.entities;
    return {
      ...state,
      entities,
      ids: state.ids.filter(catId => catId !== id),
      selectedCategoryId: state.selectedCategoryId === id ? null : state.selectedCategoryId,
      filterByCategoryIds: state.filterByCategoryIds.filter(catId => catId !== id),
      loading: false
    };
  }),

  on(CategoryActions.deleteCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Selection
  on(CategoryActions.selectCategory, (state, { id }) => ({
    ...state,
    selectedCategoryId: id
  })),

  // Filtering
  on(CategoryActions.setFilterCategories, (state, { categoryIds }) => ({
    ...state,
    filterByCategoryIds: categoryIds
  })),

  on(CategoryActions.clearFilterCategories, (state) => ({
    ...state,
    filterByCategoryIds: []
  }))
);
