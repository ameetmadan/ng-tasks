import { Category } from './category.model';

export interface CategoryState {
  entities: { [id: string]: Category };
  ids: string[];
  selectedCategoryId: string | null;
  filterByCategoryIds: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const initialCategoryState: CategoryState = {
  entities: {},
  ids: [],
  selectedCategoryId: null,
  filterByCategoryIds: [],
  loading: false,
  error: null,
  lastUpdated: null
};
