import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Order } from 'src/app/models/order.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import firebase from 'firebase/compat/app';
import db from 'src/environments/configfb';
import { OrderService } from 'src/app/services/order/order.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { LoadingController, ToastController } from '@ionic/angular';
import { Screenshot } from 'capacitor-screenshot';

declare var google;

@Component({
  selector: 'app-geo',
  templateUrl: './geo.page.html',
  styleUrls: ['./geo.page.scss'],
})
export class GeoPage implements OnInit {

  selectedImage: any;

  image: any;

  tiempoTranscurrido: number = 0;
  timer: any;


  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ordersSub: Subscription;
  profileSub: Subscription;

  usuario: any;
  cantidad: number;
  lat: any;
  lng: any;
  boton_recarga: boolean = false;
  boton_ruta_recogida: boolean = false;
  boton_entrega: boolean = false;
  distancia_validacion: number;

  id_rider: any;
  entrega: any = {}
  id_orden_asig: string;
  id_usuario_asig: string;
  orders: any = {};
  direccion_llegada_coordenadas: any;
  direccion_llegada_lugar: any;
  minutos: any;
  segundos: any;
  url_imagen: any;
  foto_boolean: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private api: ApiService,
    private global: GlobalService,
    private orderService: OrderService,
    private authService: AuthService,
    private firestore: Firestore,
    private storage: Storage,
    private toastController: ToastController,
    private loadingCtrl: LoadingController) { }



  async ngOnInit() {

    this.ordersSub = this.orderService.orders.subscribe(order => {
      this.orders = order;
    }, e => {
      console.log(e);
    });

    this.lat = this.route.snapshot.paramMap.get('lat');
    this.lng = this.route.snapshot.paramMap.get('lng');

    if (!this.lat) {
      this.navCtrl.back();
      return;
    }

    await this.cargarMapa();
    this.autocompletado(this.map, this.marker);
    this.getData();
  }

  //VARIABLES PARA EL MAPA:
  latitud: number = 0;
  longitud: number;
  //VARIABLE MAP: variable a través de la cual se carga el mapa de google.
  map: any;
  marker: any;
  search: any;
  //NECESITAMOS 2 VARIABLES GLOBALES PARA CALCULAR Y MOSTRAR RUTA EN EL MAPA:
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  async cargarMapa() {
    //obtengo latitud y longitud del navegador:

    this.lat = parseFloat(this.route.snapshot.paramMap.get('lat'));
    this.lng = parseFloat(this.route.snapshot.paramMap.get('lng'));


    //mapa: toma el elemento div llamado map desde el HTML:
    const mapa: HTMLElement = document.getElementById('map');

    this.map = new google.maps.Map(mapa, {
      center: {
        lat: this.lat,
        lng: this.lng
      },
      zoom: 14
    });
    this.directionsRenderer.setMap(this.map);
    const indicacionesHTML: HTMLElement = document.getElementById('indicaciones');
    this.directionsRenderer.setPanel(indicacionesHTML);

    this.marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      title: 'Ubicacion inicial'
    });
  }

  obtenerUbicacion(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }
  autocompletado(mapaLocal, marcadorLocal) {
    const input = document.getElementById('input-autocomplete');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', this.map);
    this.search = autocomplete;

    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace().geometry.location;
      mapaLocal.setCenter(place);
      mapaLocal.setZoom(15);

      marcadorLocal.setPosition(place);
      marcadorLocal.setMap(mapaLocal);

    });
  }

  async calcularRuta() {
    var geolocation = await this.obtenerUbicacion();

    if (this.latitud == 0) {
      this.latitud = geolocation.coords.latitude;
      this.longitud = geolocation.coords.longitude;
    }

    var request = {
      origin: { lat: this.latitud, lng: this.longitud },
      destination: { lat: this.lat, lng: this.lng },
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (resultado, status) => {
      this.directionsRenderer.setDirections(resultado);

      if (status === google.maps.DirectionsStatus.OK) {
        var distancia = google.maps.geometry.spherical.computeDistanceBetween(
          resultado.routes[0].legs[0].start_location,
          resultado.routes[0].legs[0].end_location
        );
        var distanciaEntera = parseInt(distancia);
        this.distancia_validacion = distanciaEntera
        console.log('Distancia VALIDACION:', this.distancia_validacion);
      } else {
        console.error('Error al calcular la ruta:', status);
      }
    });
    this.marker.setPosition(null);
    if (this.boton_ruta_recogida == false) {
      this.boton_ruta_recogida = true;
    } else {
      this.boton_entrega = true;
    }
  }


  async marcarRecogida() {
    this.distancia_validacion = 100
    if (this.distancia_validacion < 150) {
      await this.getData();

      this.latitud = this.direccion_llegada_coordenadas.lat;
      this.longitud = this.direccion_llegada_coordenadas.lng;


      this.boton_recarga = true;
      this.global.showAlert('Inicia ruta para ver el destino', 'Retiro Marcado',);
    } else {
      this.global.errorToast('Error, acercate al punto de recogida para');

    }

  }

  async getData() {
    // OBTENEMOS EL ID DEL RIDER LOGUEADO
    this.id_rider = this.authService.getId();
    this.id_rider = this.id_rider.__zone_symbol__value;
    this.id_rider = this.id_rider.toString(); // Convertir a cadena


    const userRef = db.collection('users').doc(this.id_rider);
    const userSnapshot = await userRef.get();
    this.entrega = userSnapshot.data(); // Obtener los datos del documento

    console.log('ENTREGA SNAPSHOT:', this.entrega);

    this.id_orden_asig = this.entrega.orden_asignada.id_orden;
    this.id_usuario_asig = this.entrega.orden_asignada.id_usuario;
    this.direccion_llegada_coordenadas = this.entrega.entrega;
    this.direccion_llegada_lugar = this.entrega.entrega.lugar;
    console.log('Direccion LLEGADA ', this.direccion_llegada_coordenadas.lat);

    const orderRef = db.collection('orders').doc(this.id_usuario_asig).collection('all').doc(this.id_orden_asig);
    const orderSnapshot = await orderRef.get();
    this.orders = orderSnapshot.data();

    console.log('ESTA ORDEN ID:', this.id_orden_asig);
    console.log('ESTA ORDEN:', this.orders);
  }

  //Funciones de conteo de tiempo
  startTimer() {
    this.timer = interval(1000).subscribe(() => {
      this.tiempoTranscurrido++;

      // Calcular minutos y segundos
      this.minutos = Math.floor(this.tiempoTranscurrido / 60);
      this.segundos = this.tiempoTranscurrido % 60;
    });
  }

  stopTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = null;
    }
  }


  //FUNCIONES DE CAMARA

  //TOMAR FOTO
  async takePicture() {
    try {
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        // allowEditing: false,
        source: CameraSource.Camera,
        width: 600,
        resultType: CameraResultType.DataUrl
      });
      console.log('image: ', image);
      this.image = image.dataUrl;
      await this.showLoading();
      const blob = this.dataURLtoBlob(image.dataUrl);
      const url = await this.uploadImage(blob, image.format);
      this.url_imagen = url;
      const response = await this.addDocument('img', {
        imageUrl: url,
        id_orden: this.id_orden_asig,
        id_rider: this.id_rider,
        id_cliente: this.id_usuario_asig
      });
      await this.loadingCtrl.dismiss();
      await this.presentToast();
      this.foto_boolean = true;
    } catch (e) {
      console.log(e);
      await this.loadingCtrl.dismiss();
    }
  }

  dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async uploadImage(blob: any, format: any) {
    try {
      const currentDate = Date.now();
      const filePath = `img/${currentDate}.${format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      console.log('task: ', task);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (e) {
      throw (e);
    }
  }

  addDocument(path: any, data: any) {
    const dataRef = collection(this.firestore, path);
    return addDoc(dataRef, data);
  }


  base64toBlob(base64String: string) {
    let b64Data = base64String;
    console.log(b64Data);
    let contentType = '';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    // let blob = new Blob(byteArrays, { type: contentType });
    // let blob = new Blob(byteArrays, { type: `image/${b64DataObject.format}` });
    let blob = new Blob(byteArrays, { type: `image/png` });
    return blob;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Imagen cargada exitosamente',
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      // duration: 3000,
      spinner: 'circles'
    });

    loading.present();
  }





  async finalizarPedido() {
    const confirm = await this.global.showAlert(
      '¿Desea finalizar pedido?', // Mensaje de la alerta
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
            this.global.showLoader();

            db.collection('users').doc(this.id_rider)
              .update({
                orden_asignada: {},
                entrega: {},
                asignado: false
              })
              .then(() => {
                console.log('Orden entregada correctamente');
              })
              .catch((error) => {
                console.log('Error al entregar la orden:', error);
              });

            db.collection('orders').doc(this.id_usuario_asig).collection('all').doc(this.id_orden_asig)
              .update({
                status: 'completed',
                evidencia: this.url_imagen,
                tiempo_espera: this.tiempoTranscurrido
              })
              .catch((error) => {
                console.log('Error al entregar la orden:', error);
              });
              this.navCtrl.navigateRoot('/tabs/ver-asignadas');//REDIRIGE A VER PEDIDOS
              this.global.hideLoader();
          }
        }
      ]
    );
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
    if (this.profileSub) this.profileSub.unsubscribe();
  }
}

