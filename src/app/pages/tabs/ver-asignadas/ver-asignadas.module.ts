import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerAsignadasPageRoutingModule } from './ver-asignadas-routing.module';

import { VerAsignadasPage } from './ver-asignadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerAsignadasPageRoutingModule
  ],
  declarations: [VerAsignadasPage]
})
export class VerAsignadasPageModule {}
