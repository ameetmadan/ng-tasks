import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../store/categories/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  @Input() category?: Category;
  @Output() save = new EventEmitter<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>();
  @Output() cancel = new EventEmitter<void>();

  categoryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      color: ['#3b82f6', Validators.required],
      icon: ['']
    });

    if (this.category) {
      this.categoryForm.patchValue(this.category);
    }
  }

  get nameControl() {
    return this.categoryForm.get('name');
  }

  get descriptionControl() {
    return this.categoryForm.get('description');
  }

  getNameError(): string {
    const control = this.nameControl;
    if (control?.hasError('required')) return 'Name is required';
    if (control?.hasError('minlength')) return 'Name must be at least 2 characters';
    if (control?.hasError('maxlength')) return 'Name must not exceed 50 characters';
    return '';
  }

  getDescriptionError(): string {
    const control = this.descriptionControl;
    if (control?.hasError('required')) return 'Description is required';
    if (control?.hasError('minlength')) return 'Description must be at least 5 characters';
    if (control?.hasError('maxlength')) return 'Description must not exceed 200 characters';
    return '';
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.save.emit(this.categoryForm.value);
      this.categoryForm.reset({ color: '#3b82f6' });
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.categoryForm.reset({ color: '#3b82f6' });
  }
}
