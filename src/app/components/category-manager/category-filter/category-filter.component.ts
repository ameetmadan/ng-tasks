import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from '../../../store/app.state';
import { Category } from '../../../store/categories/category.model';
import {
  selectAllCategories,
  selectFilterCategoryIds
} from '../../../store/categories/category.selectors';
import * as CategoryActions from '../../../store/categories/category.actions';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css']
})
export class CategoryFilterComponent {
  categories$: Observable<Category[]>;
  selectedFilterIds$: Observable<string[]>;
  isDropdownOpen = false;

  constructor(private store: Store<AppState>) {
    this.categories$ = this.store.select(selectAllCategories);
    this.selectedFilterIds$ = this.store.select(selectFilterCategoryIds);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  onToggleFilter(categoryId: string): void {
    this.selectedFilterIds$.pipe(take(1)).subscribe(ids => {
      const newIds = ids.includes(categoryId)
        ? ids.filter(id => id !== categoryId)
        : [...ids, categoryId];
      this.store.dispatch(CategoryActions.setFilterCategories({ categoryIds: newIds }));
    });
  }

  onClearFilters(): void {
    this.store.dispatch(CategoryActions.clearFilterCategories());
  }

  isSelected(categoryId: string, selectedIds: string[]): boolean {
    return selectedIds.includes(categoryId);
  }
}
