import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  public lecturas: any = [];
  public reciente: any = {};
  public message = ""
  public isNormal = true
  constructor(db: AngularFireDatabase){
    const data: AngularFireList<any> = db.list('lecturas')
    data.valueChanges().subscribe(temp =>{
      this.lecturas = temp
      this.reciente = this.lecturas[this.lecturas.length-1]
      this.verificarTemperatura(this.reciente.temperatura)
    })
  }

  ngOnInit(){
    
    var myChart = new Chart("dayChart", {
      type: 'line',
      data : {
        labels: ['00:00am', '01:00', '03:00am', '04:00am', '05:00am', '06:00am', '07:00am', '08:00am', '09:00am', '10:00am', '11:00am', '12:00pm', '13:00pm', '14:00pm', '15:00pm', '16:00pm', '17:00pm', '18:00pm', '19:00pm', '20:00pm', '21:00pm', '22:00pm', '23:00pm'],
        datasets: [{
          label: 'Temperatura en °C hoy',
          data: [null, null, null, null, null, null, null, null, null, null, null, null, null, 25, 24, 24, 25, 24, 26 ],
          fill: false,
          borderColor: '#0A7EDB',
          tension: 0.2
        }]
      }
  });
  }
  
  verificarTemperatura(temp: number){
    if(temp){
      if(temp >= 15 && temp <= 25){
        this.isNormal = true
        this.message = "La temperatura se encuentra dentro del rango normal 15-25°"
      }else{
        this.isNormal = false
        this.message = "ATENCIÓN: La temperatura se encuentra fuera del rango normal 15-25°"
      }
    }
  }
}
