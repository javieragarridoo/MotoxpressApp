import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMotoPageRoutingModule } from './add-moto-routing.module';

import { AddMotoPage } from './add-moto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMotoPageRoutingModule
  ],
  declarations: [AddMotoPage]
})
export class AddMotoPageModule {}
