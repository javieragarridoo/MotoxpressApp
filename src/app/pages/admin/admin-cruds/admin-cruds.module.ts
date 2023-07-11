import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminCrudsPageRoutingModule } from './admin-cruds-routing.module';

import { AdminCrudsPage } from './admin-cruds.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminCrudsPageRoutingModule
  ],
  declarations: [AdminCrudsPage]
})
export class AdminCrudsPageModule {}
