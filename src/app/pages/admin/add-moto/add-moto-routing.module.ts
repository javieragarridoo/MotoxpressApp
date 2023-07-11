import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMotoPage } from './add-moto.page';

const routes: Routes = [
  {
    path: '',
    component: AddMotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMotoPageRoutingModule {}
