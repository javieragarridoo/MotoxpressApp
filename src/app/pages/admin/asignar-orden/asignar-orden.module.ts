import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignarOrdenPageRoutingModule } from './asignar-orden-routing.module';

import { AsignarOrdenPage } from './asignar-orden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignarOrdenPageRoutingModule
  ],
  declarations: [AsignarOrdenPage]
})
export class AsignarOrdenPageModule {}
