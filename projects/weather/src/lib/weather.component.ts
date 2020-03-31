import { Component, Input, OnChanges, ViewEncapsulation, SimpleChange, SimpleChanges } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'lib-weather',
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
  <article class="widget">
  <div *ngIf="errText" class="error">{{errText}}</div>
  <div class="weatherIcon"><img width="100" height="100" src='{{weatherico}}'/></div>
  <div class="weatherInfo">
    <div class="temperature"><span>{{temp}}&deg;</span></div>
    <div class="description">    
      <div class="weatherCondition">{{desc}}</div>    
      <div class="place">{{city}}, {{country}}</div>
    </div>
  </div>
  <div class="date">{{dt | date:'MMM d'}}</div>
  </article>
  `,
  styles: [`
  $border-radius: 20px;
  .error {
    padding: 10px;
      background: white;
      width: 100%;
      margin-bottom: 10px;
      color: red;
      font-weight: bold;
      font-size: 14px;
      font-family: arial;
  }
  .widget {
    position: absolute;
    font-family: Poiret One;
    top: 50%;
    left: 50%;
    display: flex;
    height: 300px;
    width: 600px;
    transform: translate(-50%, -50%);
    flex-wrap: wrap;
    cursor: pointer;
    border-radius: $border-radius;
    box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15);
    
    .weatherIcon{
      flex: 1 100%;
      height: 60%;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      background: rgb(252, 224, 68);
      font-family: weathericons;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 100px;
      
      i{
        padding-top: 30px;
      }
    }
    
    .weatherInfo{
      flex: 0 0 70%;
      height: 40%;
      background: #080705;
      border-bottom-left-radius: $border-radius;
      display: flex;
      align-items: center;
      color: white;
      
      .temperature{
        flex: 0 0 40%;
        width: 100%;
        font-size: 65px;
        display: flex;
        justify-content: space-around;
      }
      
      .description{
        flex: 0 60%;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        justify-content: center;
        
        .weatherCondition{
          text-transform: uppercase;
          font-size: 35px;
          font-weight: 100;
        }
        
        .place{
          font-size: 15px;
        }
      }
    }
    
    .date{
      flex: 0 0 30%;
      height: 40%;
      background: #70C1B3;
      border-bottom-right-radius: $border-radius;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: white;
      font-size: 30px;
      font-weight: 800;
    }
  }
  
  p{
    position: fixed;
    bottom: 0%;
    right: 2%;
    a{
      text-decoration: none;
      color: #E4D6A7;
      font-size: 10px;
    }
  }
  `]
})
export class WeatherComponent implements OnChanges {
  @Input('location') location: string;
  @Input('unit') unit: string;
  public errText: string = '';
  public weathersubscription;
  public temp: number;
  public desc: string;
  public weatherico: string;
  public country: string;
  public city: string;
  public dt: Date;
  constructor(
    public _ws: WeatherService
  ) { }

  renderWeather() {
    this.weathersubscription = this._ws.getWeather(this.location, this.unit).subscribe((data) => {
      this.errText = '';
      this.temp = Math.round(data.main.temp);
      this.desc = data.weather[0].description;
      this.weatherico = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
      this.city = data.name;
      this.country = data.sys.country;
      this.getLocalTime(data.coord.lat, data.coord.lon);

    }, error => {
      this.errText = error;
    })
  }

  getLocalTime(lat, long) {
    this._ws.getLocalTime(lat, long).subscribe((data) => {
      this.dt = data.time;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['location'] || changes['unit']) {
      if (this.weathersubscription) {
        this.weathersubscription.unsubscribe();
      }
      this.renderWeather();
    }

  }


}