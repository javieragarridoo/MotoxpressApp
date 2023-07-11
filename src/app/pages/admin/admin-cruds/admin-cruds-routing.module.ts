import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCrudsPage } from './admin-cruds.page';

const routes: Routes = [
  {
    path: '',
    component: AdminCrudsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCrudsPageRoutingModule {}
