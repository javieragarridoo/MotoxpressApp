import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  uid: string;

  private _orders = new BehaviorSubject<Order[]>([]);

  public rider_id?: string; // Agrega el campo rider_id

  get orders() {
    return this._orders.asObservable();
  }

  constructor(private auth: AuthService, private api: ApiService) { }

  getRadius() {
    return this.api.radius;
  }


  async getUid() {
    if(!this.uid) return await this.auth.getId();
    else return this.uid;
  }

  async getOrderRef(uid) {
    uid= await this.getUid();
    return this.api.collection('orders').doc(uid).collection('all');
  }

  async getOrders() {
    try {
      const orders: Order[] = await (await this.getOrderRef(this.uid)).get().pipe(
        switchMap(async(data: any) => {
          let itemData = await data.docs.map(element => {
            let item = element.data();
            item.id = element.id;
            item.order = JSON.parse(item.order);
            item.restaurant.get()
            .then(rData => {
              item.restaurant = rData.data();
            })
            .catch(e => { throw(e); });
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise(); 
      console.log('orders', orders);
      this._orders.next(orders);
      return orders;
    } catch(e) {
      throw(e);
    }
  }

  async placeOrder(param) {
    try {
      
      let data = {...param};
      data.order = JSON.stringify(param.order);
      const uid = await this.getUid();
      data.restaurant = await this.api.firestore.collection('restaurants').doc(param.restaurant_id);
      const orderRef = await (await this.getOrderRef(uid)).add(data);
      const order_id = await orderRef.id;
      console.log('latest order: ', param);
      let currentOrders: Order[] = [];
      currentOrders.push(new Order(
        param.address,
        param.restaurant,
        param.restaurant_id,
        param.order,
        param.total,
        param.grandTotal,
        param.deliveryCharge,
        param.status,
        param.time,
        param.paid,    
        order_id,
        uid,
        param.instruction    
      ));
      console.log('latest order: ', currentOrders);
      currentOrders = currentOrders.concat(this._orders.value);
      console.log('orders: ', currentOrders);
      this._orders.next(currentOrders);
      return currentOrders;
    } catch(e) {
      throw(e);
    }
  }

  async asignarRider(orderId: string, riderId: string) {
    try {
      const orderRef = this.api.collection('orders').doc(orderId);
      await orderRef.update({ rider_id: riderId });
  
      // Obtener el nombre del rider a partir del riderId
      const riderData = await this.api.collection('users').doc(riderId).get().toPromise();
      const riderName = (riderData.data() as { name: string })?.name;
  
      // Actualizar el nombre del rider en la orden correspondiente
      const orders = this._orders.value;
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].rider = riderName;
        this._orders.next(orders);
      }
    } catch (error) {
      throw error;
    }
  }
  
}

