import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppShellComponent } from './app/components/app-shell/app-shell.component';
import { categoryReducer } from './app/store/categories/category.reducer';
import { CategoryEffects } from './app/store/categories/category.effects';

bootstrapApplication(AppShellComponent, {
  providers: [
    provideStore({
      categories: categoryReducer
    }),
    provideEffects([CategoryEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      trace: true,
      traceLimit: 75
    })
  ]
});
