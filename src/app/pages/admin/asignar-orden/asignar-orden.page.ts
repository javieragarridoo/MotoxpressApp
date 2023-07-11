import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Order } from 'src/app/models/order.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import firebase from 'firebase/compat/app';
import db from 'src/environments/configfb';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-asignar-orden',
  templateUrl: './asignar-orden.page.html',
  styleUrls: ['./asignar-orden.page.scss'],
})
export class AsignarOrdenPage implements OnInit {

  id: any;
  userId: any;
  isLoading: boolean;
  order: any;
  userName:any = {};
  riderUsers: any[] | string; // Array para almacenar los usuarios tipo "rider"
  selectedRider: any = ''; // Variable para almacenar el usuario seleccionado del select
  orden_entrega: any; 
  asignar_boton: boolean;



  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cartService: CartService,
    private global: GlobalService,
    private orderService: OrderService
  ) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('orderId');
    this.userId = this.route.snapshot.paramMap.get('userId');

    console.log('check id: ', this.id);
    if (!this.id) {
      this.navCtrl.back();
      return;
    }

    console.log('id:', this.id);
    console.log('User ID: ', this.userId);
    console.log('Rider: ', this.riderUsers);
    console.log('SELECT Rider: ', this.selectedRider);


    this.getOrdenes();
    console.log('Entrega: ', this.orden_entrega);
  }


  //Trae las ordenes desde la base de dato, tomando como referencia el ID de la orden y la ID de usuario asociado a esta
  async getOrdenes() {
    try {
      this.isLoading = true;
      const orderRef = db.collection('orders').doc(this.userId).collection('all').doc(this.id);
      const userRef = db.collection('users').doc(this.userId);

      const [orderSnapshot, userSnapshot] = await Promise.all([orderRef.get(), userRef.get()]);
      this.order = orderSnapshot.data();
      this.userName = userSnapshot.get('name');
      this.orden_entrega = orderSnapshot.get('entrega');

      //TRAE LOS DATOS DE LOS RIDERS FILTRANDO POR TIPO DE USUARIO Y SI ESTA ASIGNADO
      const ridersSnapshot = await db.collection('users').where('type_user', '==', 'rider').where('asignado','==',false).get();
      this.riderUsers = ridersSnapshot.docs.map((doc) => doc.data());
      if (typeof this.riderUsers === 'undefined' || this.riderUsers.length === 0) {
        this.riderUsers = [{name:'Sin riders disponibles'}];
        this.asignar_boton = false
      }
      else{this.asignar_boton=true}
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }



  async asignarOrden() {
    const confirm = await this.global.showAlert(
      '¿Deseas asignar esta orden?', // Mensaje de la alerta
      'Confirmar', // Encabezado de la alerta
      [
        // Botones de la alerta
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Acción cuando se presiona el botón "Cancelar"
            console.log('Cancelado');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Acción cuando se presiona el botón "Confirmar"
            // Insertar datos de la orden asignada al usuario "Rider"
            this.global.showLoader();

            const orderRef = db.collection('orders').doc(this.userId).collection('all').doc(this.id);
            
            const orden_asignada: any = {
              id_orden: this.id,
              id_usuario: this.userId,
              
            }

            db.collection('users').doc(this.selectedRider.uid)
              .update({ orden_asignada: orden_asignada,
                        entrega: this.order.entrega,
                        asignado: true})
              .then(() => {
                console.log('Orden asignada correctamente');
              })
              .catch((error) => {
                console.log('Error al asignar la orden:', error);
              });

            //Insertar datos del usuario "Rider" en la orden 
            const id_rider: any = this.selectedRider.uid;
            
            orderRef.update({
              id_rider: id_rider,
              status: 'assigned'
            });
            this.navCtrl.navigateRoot('/admin/ver-ordenes');//REDIRIGE A VER PEDIDOS
            this.global.hideLoader();
          }
        }
      ]
    );
  }
  
}
