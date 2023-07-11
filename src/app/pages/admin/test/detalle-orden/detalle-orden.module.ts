import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleOrdenPageRoutingModule } from './detalle-orden-routing.module';

import { DetalleOrdenPage } from './detalle-orden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleOrdenPageRoutingModule
  ],
  declarations: [DetalleOrdenPage]
})
export class DetalleOrdenPageModule {}
