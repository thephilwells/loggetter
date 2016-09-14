import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormComponent }  from './form.component';

const appRoutes: Routes = [
  {
    path: '',
    component: FormComponent
  },
  {
    path: 'form',
    component: FormComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);