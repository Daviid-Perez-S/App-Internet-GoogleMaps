import { Component, AfterViewInit, OnInit } from '@angular/core';
// Este es el import para la Geolocalización
import { Geolocation } from '@ionic-native/geolocation/ngx';
// Este es el import para la Red
import { Network } from '@ionic-native/network/ngx'
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  map: GoogleMap;
  latitude: number;
  longitude: number;


  constructor(
    private geolocation: Geolocation,
    private network: Network,
    private platform: Platform
  ) {}

  async ngOnInit(){
    // Esta es la parte para checar la conexión de internet
    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('Red conectada');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('Tenemos conexión WIFI de Internet');
        }
        if(this.network.type === '3G') {
          console.log('Tenemos conexión 3G de Internet');
        }
        if(this.network.type === 'none') {
          console.log('No hay internet :(');
        }
        console.log("Ya pasé por lo de Network");
      }, 5000);
    });

    // stop connect watch
    connectSubscription.unsubscribe();
    await this.getPosition();
    await this.platform.ready().then(()=>{
      this.getMap();
    })
  }

  // ngAfterViewInit() {
  //   this.getPosition();
  //   this.getMap();
  //   //this.iniciar();
  // }

  iniciar() {
    // Wait the native plugin is ready.
    this.platform.ready().then(() => {
      this.getPosition();
      this.getMap();
    });
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then(response => {
      console.log(response);
      console.log("Es de tipo => " + typeof(response.coords.latitude))
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
      console.log("Latitud => " + this.latitude )
      console.log("Longitud => " + this.longitude )
    }).catch((error) => {
      console.log('Error al obtener la geolocalización', error);
    });
  }

  getMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('mapa', mapOptions);
    let marker: Marker = this.map.addMarkerSync({
      title: 'u r here',
      icon: 'blue',
      animation: 'DROP',
      position: {
          lat: this.latitude,
          lng: this.longitude
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('¡CLICK!');
    });
  }
}
