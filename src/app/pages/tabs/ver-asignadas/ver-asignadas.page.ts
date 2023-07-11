import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { Strings } from 'src/app/enum/strings.enum';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AllorderService } from '../../../services/order/allorder.service';
import db from 'src/environments/configfb';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-ver-asignadas',
  templateUrl: './ver-asignadas.page.html',
  styleUrls: ['./ver-asignadas.page.scss'],
})
export class VerAsignadasPage implements OnInit {

  profile: any = {};
  isLoading: boolean;
  orders: any = {};
  ordersSub: Subscription;
  profileSub: Subscription;
  id_rider: any;
  entrega: any = {}
  id_orden_asig: string;
  id_usuario_asig: string;
  lat:any;
  lng:any;

  constructor(
    private navCtrl: NavController,
    private orderService: OrderService,
    private cartService: CartService,
    private global: GlobalService,
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(order => {
      console.log('order data: ', order);
      this.orders = order;
    }, e => {
      console.log(e);
    });
    this.profileSub = this.profileService.profile.subscribe(profile => {
      this.profile = profile;
      console.log(this.profile);
    });
    this.getData();
  }

  async getData() {
    // OBTENEMOS EL ID DEL RIDER LOGUEADO
    this.id_rider = this.authService.getId();
    this.id_rider = this.id_rider.__zone_symbol__value;
    this.id_rider = this.id_rider.toString(); // Convertir a String
  
    console.log('ID RIDER:', this.id_rider);
  
    const userRef = db.collection('users').doc(this.id_rider);
    const userSnapshot = await userRef.get();
    this.entrega = userSnapshot.data(); // Obtener los datos del usuario Rider
    console.log('DATOS RIDER:', this.entrega);
    
    this.id_orden_asig = this.entrega.orden_asignada.id_orden;
    this.id_usuario_asig = this.entrega.orden_asignada.id_usuario;

    const orderRef = db.collection('orders').doc(this.id_usuario_asig).collection('all').doc(this.id_orden_asig);
    const orderSnapshot = await orderRef.get();
    this.orders = orderSnapshot.data();


  }

  confirmLogout() {
    this.global.showAlert(
      'Are you sure you want to sign-out?',
      'Confirm',
      [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          this.logout();
        }
      }]
    );
  }

  logout() {
    this.global.showLoader();
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot(Strings.LOGIN);
      this.global.hideLoader();
    })
      .catch(e => {
        console.log(e);
        this.global.hideLoader();
        this.global.errorToast('Logout Failed! Check your internet connection');
      });
  }

  async reorder(order: Order) {
    console.log(order);
    let data = await this.cartService.getCart();
    console.log('data: ', data);
    if (data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }

  getHelp(order) {
    console.log(order);
  }

  async editProfile() {
    const options = {
      componentProps: {
        profile: this.profile
      },
      cssClass: 'custom-modal',
      swipeToClose: true, // not in use anymore
      // use below properties to close modal in ios, and remove swipetoclose
      // breakpoints: [0, 0.5, 0.8],
      // initialBreakpoint: 0.8
    };
    const modal = await this.global.createModal(options);
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
    if (this.profileSub) this.profileSub.unsubscribe();
  }

}