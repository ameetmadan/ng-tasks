import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../store/app.state';
import {
  selectCategoriesCount,
  selectCategoriesWithStats
} from '../../../store/categories/category.selectors';

@Component({
  selector: 'app-category-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-stats.component.html',
  styleUrls: ['./category-stats.component.css']
})
export class CategoryStatsComponent {
  totalCategories$: Observable<number>;
  categoriesWithStats$: Observable<any[]>;

  constructor(private store: Store<AppState>) {
    this.totalCategories$ = this.store.select(selectCategoriesCount);
    this.categoriesWithStats$ = this.store.select(selectCategoriesWithStats);
  }
}
