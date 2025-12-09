import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { TaskService } from '../services/task.service';

export class TaskValidators {
  static minWordCount(minWords: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const wordCount = control.value.trim().split(/\s+/).length;
      return wordCount < minWords ? { minWordCount: { required: minWords, actual: wordCount } } : null;
    };
  }

  static noSpecialCharsAtStart(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const startsWithSpecialChar = /^[^a-zA-Z0-9]/.test(control.value);
      return startsWithSpecialChar ? { specialCharsAtStart: true } : null;
    };
  }

  static duplicateTitle(taskService: TaskService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(title => taskService.checkDuplicateTitle(title)),
        map(isDuplicate => isDuplicate ? { duplicateTitle: true } : null),
        catchError(() => of(null))
      );
    };
  }
}
