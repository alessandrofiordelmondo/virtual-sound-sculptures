import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment }from '../environments/environment'
import { Coord, SculptureInterface } from './interfaces'

declare const Convexhull

@Injectable({
  providedIn: 'root'
})
export class InteractiveMapService {
  constructor() { }
  isLoaded:boolean = false;
  map: mapboxgl.Map;
  staticMap: mapboxgl.Map;
  pointer: mapboxgl.Marker;
  
  private convexHull = new Convexhull()
  public sculptureData: SculptureInterface[] = [];
  
  public enableAnimation:boolean = true;
  public constantCentering: boolean = true;

  createMap(container, latitude, longitude, zoom){
    return new Promise((resolve) => {
      mapboxgl.accessToken = environment.mapBoxToken;
      this.map = new mapboxgl.Map({
        container: container,
        style: environment.mapBoxStyle,
        center: [longitude, latitude],
        zoom: zoom,
        attributionControl: false
      }).on('dataloading', () => {
        this.map.resize();
        this.isLoaded = true;
        resolve()
      }).on('touchstart', () => {
        this.enableAnimation = false;
        this.constantCentering = false;
      }).on('touchend', () => {
        this.enableAnimation = true
      })
    })
  }
  // create the map for SculptureCardComponent
  createStaticMap(container, latitude, longitude, zoom){
    return new Promise((resolve) => {
      mapboxgl.accessToken = environment.mapBoxToken;
      this.staticMap = new mapboxgl.Map({
        container: container,
        style: environment.mapBoxStyle,
        center: [longitude, latitude],
        zoom: zoom,
        attributionControl: false,
        interactive: false
      }).on('dataloading', () => {
        this.staticMap.resize();
        resolve()
      })
    })
  }

  createPointer(container,  latitude, longitude){
    this.pointer = new mapboxgl.Marker( container )
      .setLngLat([longitude, latitude])
      .addTo(this.map)
  }
  
  updateMap(heading, lat, lon){
    if (this.isLoaded && this.enableAnimation){
      this.map.rotateTo(heading, {duration: 0})
      this.pointer.setLngLat([lon, lat])
      if(this.constantCentering){
        this.map.setCenter([lon, lat])
      }
    }
  }
  
  highlightArea(){
    this.sculptureData.forEach((sculpture:SculptureInterface) => {
      const id = `sculpture-${sculpture.name}`;
      const outlines = this.getOutlines(sculpture.coords)   
      this.map.addSource(id, {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [outlines]
          }
        }
      });
  
      this.map.addLayer({
        'id': id,
        'type': 'fill',
        'source': id,
        'layout': {},
        'paint': {
          'fill-color': sculpture.color,
          'fill-opacity': 0.4
        }
      });
      
      this.map.addLayer({
        'id': id+'poi-labels',
        'type': 'symbol',
        'source': id,
        'layout': {
        'text-field': sculpture.name,
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.5,
        'text-justify': 'auto',
        'text-size': 10,
        'text-ignore-placement': true
        },
        'paint': {
          "text-color": "#aaa"
        }
      });
    })
  }

  //Higlight single area for SculptureCardComponent
  highlightSingleArea(sculpture: SculptureInterface){
    const id = `sculpture-${sculpture.name}`;
    const outlines = this.getOutlines(sculpture.coords)   
    this.staticMap.addSource(id, {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [outlines]
        }
      }
    });

    this.staticMap.addLayer({
      'id': id,
      'type': 'fill',
      'source': id,
      'layout': {},
      'paint': {
        'fill-color': sculpture.color,
        'fill-opacity': 0.2
      }
    });
    
    this.staticMap.addLayer({
      'id': id+'poi-labels',
      'type': 'symbol',
      'source': id,
      'layout': {
      'text-field': sculpture.name,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
      'text-size': 10,
      'text-ignore-placement': true
      },
      'paint': {
        "text-color": "#aaa"
      }
    });
  }

  getOutlines(coords:Coord[]){
    let outlineCoords = this.convexHull.makeHull(coords)
    let arr = new Array();
    outlineCoords.forEach((coord:Coord) => {
      arr.push([coord.lon, coord.lat]);
      })
    return arr
  }
  
  getCentroid(coords: Coord[]){
    const len = coords.length;
    let lonCentroid = 0;
    let latCentroid = 0;
    for (let i in coords){
      lonCentroid += (coords[i].lon / len)
      latCentroid += (coords[i].lat / len)
    }
    return [lonCentroid, latCentroid]
  }

  centerMap(){
    this.enableAnimation = false;
    this.constantCentering = false;
    
    const speed = 0.3;
    const time = speed * 1000 * Math.PI;
    
    const p = this.pointer.getLngLat()
    this.map.flyTo({
      center: [p.lng, p.lat], 
      speed: speed, 
      curve: 1
      })
    setTimeout(() => {
      this.enableAnimation = true;
      this.constantCentering = true;
    }, time)
  }
}
