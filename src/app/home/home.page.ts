import { Component, AfterViewInit } from '@angular/core';
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
} from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map: GoogleMap;
  latitude: number;
  longitude: number;


  constructor(
    private geolocation: Geolocation,
    private network: Network,
    private platform: Platform
  ) {

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

    // ########################################

    this.getPosition();
    this.getMap();
    //this.iniciar();
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
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
    }).catch((error) => {
      console.log('Error al obtener la geolocalización', error);
    });
  }

  getMap() {

    // This code is necessary for browser
    Environment.setEnv({
      // Esta parte se pone así según el profe, ponemos nuestra API KEY aquí.
      'API_KEY_FOR_BROWSER_RELEASE': 'https//www.google.com/maps/embed/v1/MODE?key=AIzSyDvnrn4179xHiXqCU_8c_ot4VeIJEcrNJ8',
      'API_KEY_FOR_BROWSER_DEBUG': 'https//www.google.com/maps/embed/v1/MODE?key=AIzSyDvnrn4179xHiXqCU_8c_ot4VeIJEcrNJ8'
    });

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
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: this.latitude,
        lng: this.longitude
      }
    });

    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('Me tocaste ehh');
    });

  }
}
