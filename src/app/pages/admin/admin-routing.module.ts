import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';


const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'admin-cruds',
        loadChildren: () => import('./admin-cruds/admin-cruds.module').then( m => m.AdminCrudsPageModule)
      },
      {
        path: 'ver-ordenes',
        loadChildren: () => import('./ver-ordenes/ver-ordenes.module').then( m => m.VerOrdenesPageModule)
      },
      {
        path: '',
        redirectTo: '/admin/admin-cruds',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'ver-ordenes/asignar-orden/:orderId/:userId',
    loadChildren: () => import('./asignar-orden/asignar-orden.module').then( m => m.AsignarOrdenPageModule)
  },
  {
        path: 'add-banner',
        loadChildren: () => import('./add-banner/add-banner.module').then( m => m.AddBannerPageModule)
      },
      {
        path: 'add-restaurant',
        loadChildren: () => import('./add-restaurant/add-restaurant.module').then( m => m.AddRestaurantPageModule)
      },
      {
        path: 'add-menu-item',
        loadChildren: () => import('./add-menu-item/add-menu-item.module').then( m => m.AddMenuItemPageModule)
      },
      {
        path: 'test',
        loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
      },
    
      {
        path: 'add-moto',
        loadChildren: () => import('./add-moto/add-moto.module').then( m => m.AddMotoPageModule)
      }

];
// const routes: Routes = [
//   {
//     path: '',
//     component: AdminPage
//   },
//   {
//     path: 'add-banner',
//     loadChildren: () => import('./add-banner/add-banner.module').then( m => m.AddBannerPageModule)
//   },
//   {
//     path: 'add-restaurant',
//     loadChildren: () => import('./add-restaurant/add-restaurant.module').then( m => m.AddRestaurantPageModule)
//   },
//   {
//     path: 'add-menu-item',
//     loadChildren: () => import('./add-menu-item/add-menu-item.module').then( m => m.AddMenuItemPageModule)
//   },
//   {
//     path: 'admin-cruds',
//     loadChildren: () => import('./admin-cruds/admin-cruds.module').then( m => m.AdminCrudsPageModule)
//   },

//   {
//     path: 'test',
//     loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
//   },

//   {
//     path: 'add-moto',
//     loadChildren: () => import('./add-moto/add-moto.module').then( m => m.AddMotoPageModule)
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
