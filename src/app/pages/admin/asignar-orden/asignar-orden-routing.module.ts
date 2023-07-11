import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarOrdenPage } from './asignar-orden.page';

const routes: Routes = [
  {
    path: '',
    component: AsignarOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignarOrdenPageRoutingModule {}
