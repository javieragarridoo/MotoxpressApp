import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestPage } from './test.page';

const routes: Routes = [
  {
    path: '',
    component: TestPage
  },
  {
    path: 'detalle-orden/:orderId',
    loadChildren: () => import('./detalle-orden/detalle-orden.module').then( m => m.DetalleOrdenPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestPageRoutingModule {}
