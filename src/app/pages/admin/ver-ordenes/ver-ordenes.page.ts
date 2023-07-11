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
import db from 'src/environments/configfb';


@Component({
  selector: 'app-ver-ordenes',
  templateUrl: './ver-ordenes.page.html',
  styleUrls: ['./ver-ordenes.page.scss'],
})
export class VerOrdenesPage implements OnInit {

  profile: any = {};
  isLoading: boolean;
  orders: Order[] = [];
  ordersSub: Subscription;
  profileSub: Subscription;
  data_order:Order [] = [];
  id_user: any;


  constructor(
    private navCtrl: NavController,
    private orderService: OrderService,
    private cartService: CartService,
    private global: GlobalService,
    private profileService: ProfileService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.getDataOrdenes();
    console.log('TESTEANDO ORDENES:',this.orders)
    this.profileSub = this.profileService.profile.subscribe(profile => {
      this.profile = profile;
    });
    this.getData();
    this.isLoading = false;
  }

  async getDataOrdenes() {
    this.isLoading = true;
    this.global.showLoader();
    const usuariosRef = db.collection('users');
    usuariosRef.onSnapshot((snap) => {
      const usuarios: any[] = [];
      snap.forEach((snapHijo) => {
        usuarios.push({
          id_user: snapHijo.id,
        });
      });
  
      const data_order: Order[] = [];
  
      usuarios.forEach((usuario) => {
        const usuarioId = usuario.id_user;
        const allRef = db
          .collection('orders')
          .doc(usuarioId)
          .collection('all');
  
        allRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data() as Order;
            const orderId = doc.id;
  
            const hasValues = Object.keys(data).some((key) => data[key].length > 0);
  
            if (data && hasValues) {
              data.id = orderId;
              data.usuarioId = usuarioId; // Agrega el usuarioId al objeto 'data'
              data_order.push(data);
            }
          });
  
          if (data_order.length > 0 && data_order) {
            this.orders = data_order;
          }
        }).catch((error) => {
          console.error('Error al obtener los documentos:', error);
        });
      });
    });

    this.isLoading = false;
    this.global.hideLoader(); 
  }




  async getData() {
    this.isLoading = true;
    await this.profileService.getProfile();
    this.isLoading = false; 
  }




  //MENSAJE DE ALERTA PARA CONFIRMAR EL LOGOUT
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
//ACCION DESPUES QUE SE ACEPTA EL MENSAJE
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


  

  //CODIGO A UTILIZAR CUANDO SE IMPLEMENTE EL CHAT
  getHelp(order) {
    console.log(order);
  }

  ngOnDestroy() {
    if(this.ordersSub) this.ordersSub.unsubscribe();
    if(this.profileSub) this.profileSub.unsubscribe();
  }

}
