import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { AuthRiderService } from 'src/app/services/auth/authrider.service';

@Component({
  selector: 'app-add-moto',
  templateUrl: './add-moto.page.html',
  styleUrls: ['./add-moto.page.scss'],
})
export class AddMotoPage implements OnInit {


  isLoading: boolean = false;

  constructor(
    private authRiderService: AuthRiderService, 
    private router: Router,
    private global: GlobalService) { }

  ngOnInit() {
    this.isLoggedIn();
  }


  
  async isLoggedIn() {
    try {
      this.global.showLoader();
      const val = await this.authRiderService.getId();
      console.log(val);
      //if(val) this.navigate();
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
    }
  }

  onSubmit(form: NgForm) {
    if(!form.valid) return;
    this.register(form);
  }

  register(form: NgForm) {
    this.isLoading = true;
    console.log(form.value);
    const riderFormValue = { ...form.value};
    this.authRiderService.register(riderFormValue).then((data: any) => {
      console.log('riderFormValue:', riderFormValue);
      console.log(data);
      this.isLoading = false;
      form.reset();
    })
    .catch(e => {
      console.log(e);
      this.isLoading = false;
      let msg: string = 'Could not sign you up, please try again.';
      if(e.code == 'auth/email-already-in-use') {
        msg = e.message;
      }
      this.global.showAlert(msg);
    });
  }
  
  /*
  navigate(type?) {    
    let url = '/tabs';
    if(type == 'admin') url = "/admin";
    this.router.navigateByUrl(url);
  } */

}


