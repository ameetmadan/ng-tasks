import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, first } from 'rxjs/operators';
import { CategoryApiService } from '../services/category-api.service';

export class CategoryValidators {

  static duplicateCategoryName(
    categoryApiService: CategoryApiService,
    excludeId?: string
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() =>
          categoryApiService.checkDuplicateCategoryName(control.value, excludeId)
        ),
        map(exists => exists ? { duplicateCategoryName: true } : null),
        first()
      );
    };
  }

  static validColor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      return hexColorRegex.test(control.value) ? null : { invalidColor: true };
    };
  }

  static validCategoryName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const name = control.value.trim();

      if (name.length < 2) {
        return { minLength: { required: 2, actual: name.length } };
      }

      if (name.length > 50) {
        return { maxLength: { required: 50, actual: name.length } };
      }

      const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
      if (!validNameRegex.test(name)) {
        return { invalidCharacters: true };
      }

      return null;
    };
  }

  static noSpecialCharsAtStart(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value.trim();
      const specialCharsRegex = /^[^a-zA-Z0-9]/;

      return specialCharsRegex.test(value) ? { specialCharsAtStart: true } : null;
    };
  }
}
