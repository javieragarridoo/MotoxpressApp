import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerOrdenesPageRoutingModule } from './ver-ordenes-routing.module';

import { VerOrdenesPage } from './ver-ordenes.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerOrdenesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [VerOrdenesPage]
})
export class VerOrdenesPageModule {}
