import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from './category.state';
import { Category } from './category.model';

// Feature selector
export const selectCategoryState = createFeatureSelector<CategoryState>('categories');

// Basic selectors
export const selectAllCategoryIds = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.ids
);

export const selectCategoryEntities = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.entities
);

export const selectAllCategories = createSelector(
  selectAllCategoryIds,
  selectCategoryEntities,
  (ids, entities) => ids.map(id => entities[id])
);

export const selectCategoriesLoading = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.loading
);

export const selectCategoriesError = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.error
);

export const selectSelectedCategoryId = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.selectedCategoryId
);

export const selectFilterCategoryIds = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.filterByCategoryIds
);

// Derived selectors
export const selectSelectedCategory = createSelector(
  selectCategoryEntities,
  selectSelectedCategoryId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectCategoryById = (id: string) => createSelector(
  selectCategoryEntities,
  (entities) => entities[id]
);

export const selectCategoriesCount = createSelector(
  selectAllCategoryIds,
  (ids) => ids.length
);

export const selectFilteredCategories = createSelector(
  selectAllCategories,
  selectFilterCategoryIds,
  (categories, filterIds) =>
    filterIds.length > 0
      ? categories.filter(cat => filterIds.includes(cat.id))
      : categories
);

// Complex derived state - Categories with task statistics
export const selectCategoriesWithStats = createSelector(
  selectAllCategories,
  (categories) => {
    return categories.map(category => ({
      ...category,
      taskCount: 0,
      completedCount: 0,
      activeCount: 0,
      completionPercentage: 0
    }));
  }
);

// Selector for category colors (useful for UI)
export const selectCategoryColorMap = createSelector(
  selectCategoryEntities,
  (entities) => {
    const colorMap: { [id: string]: string } = {};
    Object.keys(entities).forEach(id => {
      colorMap[id] = entities[id].color;
    });
    return colorMap;
  }
);

// Recent categories (updated in last 24 hours)
export const selectRecentCategories = createSelector(
  selectAllCategories,
  (categories) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return categories.filter(cat => new Date(cat.updatedAt) > oneDayAgo);
  }
);
