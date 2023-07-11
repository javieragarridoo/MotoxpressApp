import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  isLoading: boolean;

  //VARIABLE PERFIL
  profile: any = {};
  profileSub: Subscription;
  user_type: string;

  constructor(private profileService: ProfileService,) {}

  ngOnInit() {
    this.profileSub = this.profileService.profile.subscribe(profile => {
      this.profile = profile;
      if (this.profile && this.profile.type_user) {
        this.user_type = this.profile.type_user;
        console.log('PERFIL TABS:', this.user_type);
      } else {
        this.user_type = 'Tipo de usuario no disponible'; // Establece un valor predeterminado
        console.error('El objeto profile es nulo o la propiedad type_user es indefinida');
      }
    });
    this.getData();
  }
  

  async getData() {
    this.isLoading = true;
    await this.profileService.getProfile();
    this.isLoading = false; 
  }

  recargarPagina() {
    window.location.reload();
  }
  

}
