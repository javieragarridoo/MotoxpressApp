import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Cart } from 'src/app/interfaces/cart.interface';
import { Address } from 'src/app/models/address.model';
// import { Cart } from 'src/app/models/cart.model';
import { AddressService } from 'src/app/services/address/address.service';
// import { Order } from 'src/app/models/order.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';

declare var google;


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, {static: false}) content: IonContent;

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  usuario: any;
  cantidad : number;


  urlCheck: any;
  url: any;
  model = {} as Cart;
  deliveryCharge = 20;
  instruction: any;
  location = {} as Address;
  cartSub: Subscription;
  addressSub: Subscription;
  selectedLocation: string;
  entrega :any = {}

  buscado: boolean = false;
  boton_recarca: boolean = true;
  boton_iniciar: boolean = false;
  direccionEntrega: string = '';

    //VARIABLES PARA EL MAPA:
    latitud: number;
    longitud: number;
    //VARIABLE MAP: variable a través de la cual se carga el mapa de google.
    map: any;
    marker: any;
    search: any;
    //NECESITAMOS 2 VARIABLES GLOBALES PARA CALCULAR Y MOSTRAR RUTA EN EL MAPA:
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private orderService: OrderService,
    private global: GlobalService,
    private cartService: CartService,
    private addressService: AddressService,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    
    await this.getData();
    this.addressSub = this.addressService.addressChange.subscribe(async (address) => {
      console.log('location cart: ', address);
      this.location = address;
      if(this.location?.id && this.location?.id != '') {
        const radius = this.orderService.getRadius();
        const result = await this.cartService.checkCart(this.location.lat, this.location.lng, radius);
        console.log(result);
        if(result) {
          this.global.errorToast(
            'Your location is too far from the restaurant in the cart, kindly search from some other restaurant nearby.',
            5000);
          this.cartService.clearCart();
        }
      }
    });
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart page: ', cart);
      this.model = cart;
      if(!this.model) this.location = {} as Address;
      console.log('cart page model: ', this.model);
    });

    await this.cargarMapa();
    this.autocompletado(this.map, this.marker);

  }

  async getData() {
    await this.checkUrl();
    await this.cartService.getCartData();
  }

  checkUrl() {
    let url: any = (this.router.url).split('/');
    console.log('url: ', url);
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    console.log('urlcheck: ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {
    return this.url.join('/');
  }

  quantityPlus(index) {
    this.cartService.quantityPlus(index);
  }

  quantityMinus(index) {
    this.cartService.quantityMinus(index);
  }

  addAddress(location?) {
    let url: any;
    let navData: NavigationExtras;
    if(location) {
      location.from = 'cart';
      navData = {
        queryParams: {
          data: JSON.stringify(location)
        }
      }
    }
    if(this.urlCheck == 'tabs') url = ['/', 'tabs', 'address', 'edit-address'];
    else url = [this.router.url, 'address', 'edit-address'];
    this.router.navigate(url, navData);
  }

  async changeAddress() {
    try {
      const options = {
        component: SearchLocationComponent,
        swipeToClose: true,
        cssClass: 'custom-modal',
        componentProps: {
          from: 'cart'
        }
      };
      const address = await this.global.createModal(options);
      if(address) {
        if(address == 'add') this.addAddress();
        await this.addressService.changeAddress(address);
      }
    } catch(e) {
      console.log(e);
    }
  }

  async makePayment() {
    try {
      console.log('model: ', this.model);
      const data = {
        restaurant_id: this.model.restaurant.uid,
        instruction: this.instruction ? this.instruction : '',
        restaurant: this.model.restaurant,
        order: this.model.items, //JSON.stringify(this.model.items)
        time: moment().format('lll'),
        address: this.location,
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD',
        entrega: this.entrega,
      };
      console.log('order: ', data);
      await this.orderService.placeOrder(data);
      // clear cart
      await this.cartService.clearCart();
      this.model = {} as Cart;
      this.global.successToast('Your Order is Placed Successfully');
      this.navCtrl.navigateRoot(['tabs/account']);
    } catch(e) {
      console.log(e);
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave CartPage');
    if(this.model?.items && this.model?.items.length > 0) {
      this.cartService.saveCart();
    }
  }

  ngOnDestroy() {
    console.log('Destroy CartPage');
    if(this.addressSub) this.addressSub.unsubscribe();
    if(this.cartSub) this.cartSub.unsubscribe();
  }




  



  async cargarMapa(){
    //obtengo latitud y longitud del navegador:
    var geolocation = await this.obtenerUbicacion();
    this.latitud = geolocation.coords.latitude;
    this.longitud = geolocation.coords.longitude;

    //mapa: toma el elemento div llamado map desde el HTML:
    const mapa: HTMLElement = document.getElementById('map');

    this.map = new google.maps.Map(mapa, {
      center: {
        lat: -33.598407852011846,
        lng: -70.57909246040431
      },
      zoom: 14
    });
    this.directionsRenderer.setMap(this.map);
    const indicacionesHTML: HTMLElement = document.getElementById('indicaciones');
    this.directionsRenderer.setPanel(indicacionesHTML);

    this.marker = new google.maps.Marker({
      position: {lat: this.latitud, lng: this.longitud},
      map: this.map,
      title: 'Ubicacion inicial'
    });
  }

  async recargarMapa(){
    //obtengo latitud y longitud del navegador:
    var geolocation = await this.obtenerUbicacion();
    this.latitud = geolocation.coords.latitude;
    this.longitud = geolocation.coords.longitude;

    //mapa: toma el elemento div llamado map desde el HTML:
    const mapa: HTMLElement = document.getElementById('map');

    this.map = new google.maps.Map(mapa, {
      center: {lat: this.location.lat, lng: this.location.lng},
      zoom: 14
    });
    this.directionsRenderer.setMap(this.map);
    const indicacionesHTML: HTMLElement = document.getElementById('indicaciones');
    this.directionsRenderer.setPanel(indicacionesHTML);

    this.marker = new google.maps.Marker({
      position: {lat: this.location.lat, lng: this.location.lng},
      map: this.map,
      title: 'Ubicacion inicial'
    });
    this.boton_iniciar=true;
    this.boton_recarca=false;
  }

  obtenerUbicacion(): Promise<any>{
    return new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }

  autocompletado(mapaLocal, marcadorLocal){
    const input = document.getElementById('input-autocomplete');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', this.map);
    this.search = autocomplete;

    autocomplete.addListener('place_changed', function(){
      var place = autocomplete.getPlace().geometry.location;
      mapaLocal.setCenter(place);
      mapaLocal.setZoom(15);
      marcadorLocal.setPosition(place);
      marcadorLocal.setMap(mapaLocal);

    });
    
  }

  onInputChange(event: any) {
    this.direccionEntrega = event.target.value;
  }

  onInputChangePromise() {
     return new Promise<void>(resolve => {
      // Esperar un breve tiempo (por ejemplo, 500 ms) antes de resolver la Promesa
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  async calcularRuta() {
    // Esperar a que se realice el cambio en el input
    await this.onInputChangePromise();
    var place = this.search.getPlace().geometry.location;
    
    var request = {
      origin: {lat: this.location.lat, lng: this.location.lng},
      destination: place,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (resultado, status) => {
      this.directionsRenderer.setDirections(resultado);
    });
    this.marker.setPosition(null);
    
    this.entrega.lugar = this.direccionEntrega
    this.entrega.lat = place.lat();
    this.entrega.lng = place.lng();

    console.log('Entrega: ',this.entrega)

    this.buscado = true;
  }

}
