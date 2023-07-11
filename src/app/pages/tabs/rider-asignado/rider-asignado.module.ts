import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiderAsignadoPageRoutingModule } from './rider-asignado-routing.module';

import { RiderAsignadoPage } from './rider-asignado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiderAsignadoPageRoutingModule
  ],
  declarations: [RiderAsignadoPage]
})
export class RiderAsignadoPageModule {}
