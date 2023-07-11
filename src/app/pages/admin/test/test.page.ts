import { Component, OnInit } from '@angular/core';
import { get } from 'http';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { Order } from 'src/app/models/order.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AllorderService } from 'src/app/services/order/allorder.service';
import db from 'src/environments/configfb';
import { retornarDocumentos } from 'src/environments/mostrar-documentos';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  data_order:Order [] = [];
  id_user: any;
  orden_id: any;
  ordersSub: Subscription;  
  orders: Order[] = [];

  constructor(private api: ApiService,
    private orderService: AllorderService,
    private router: Router ) {}

  ngOnInit() {
    this.getDatausuario();
    console.log('Datos antes de concatenar:', this.data_order);
  }
  //AYLAN
  async getDatausuario() {
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
  
          if (data_order.length > 0) {
            this.data_order = data_order;
          }
        }).catch((error) => {
          console.error('Error al obtener los documentos:', error);
        });
      });
    });
  }
  
    // Función para iterar sobre data_order
    iterateDataOrder() {
      for (const order of this.data_order) {
        // Realiza las operaciones deseadas con cada order
        console.log(order); // Ejemplo: Imprimir cada order en la consola
      }
    }
  
  
    // Método para seleccionar una data_order y redirigir al detalle
    selectDataOrder(dataOrder: Order) {
      // Redirigir a la página de detalle de la orden con el ID de la orden
      this.router.navigate(['/detalle-orden', dataOrder.id]);
    }
}

  