import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../store/categories/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId: string | null = null;
  @Input() loading: boolean = false;
  @Output() select = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onSelect(id: string): void {
    this.select.emit(id);
  }

  onEdit(id: string, event: Event): void {
    event.stopPropagation();
    this.edit.emit(id);
  }

  onDelete(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this category?')) {
      this.delete.emit(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedCategoryId === id;
  }
}
