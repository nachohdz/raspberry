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
  public tempReciente = ""
  public message = ""
  public isNormal = true
  public dia = ""
  public mes = ""
  public year = ""
  public promedio : any = null

  dayLectures = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]

  constructor(db: AngularFireDatabase){
    const data: AngularFireList<any> = db.list('lecturas')
    data.valueChanges().subscribe(temp =>{
      this.lecturas = temp
      this.reciente = this.lecturas[this.lecturas.length-1]
      this.tempReciente = this.reciente.temperatura + '° C'
      this.verificarTemperatura(this.reciente.temperatura)
      this.dateFormat(this.reciente.fecha)
      this.setDayLectures(this.lecturas)
    })
  }

 

  ngOnInit(){
    

  }

  months = [ "null", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
           "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];

  dateFormat(fecha: string){
    this.dia = fecha.slice(0,2)
    this.mes = this.months[parseInt(fecha.slice(2,4))]
    this.year = fecha.slice(4,8)
  }

  setDayLectures(lecturas: any){
    var d = new Date ();

    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear()

    lecturas.map((item: any) => {
      if(year == item.fecha.slice(4,8) && month == parseInt(item.fecha.slice(2,4)) && day == item.fecha.slice(0,2)){
        var hora = item.hora.slice(0,2)
        this.dayLectures[parseInt(hora)] = item.temperatura
      }
    })
    this.promedio = this.temperaturaPromedio()

    var myChart = new Chart("dayChart", {
      type: 'line',
      data : {
        labels: ['00:00am', '01:00am', '02:00am', '03:00am', '04:00am', '05:00am', '06:00am', '07:00am', '08:00am', '09:00am', '10:00am', '11:00am', '12:00pm', '13:00pm', '14:00pm', '15:00pm', '16:00pm', '17:00pm', '18:00pm', '19:00pm', '20:00pm', '21:00pm', '22:00pm', '23:00pm'],
        datasets: [{
          label: 'Temperatura en °C',
          data: this.dayLectures,
          fill: false,
          borderColor: '#0A7EDB',
          tension: 0.2
        }]
      }
  });
  }

  temperaturaPromedio(){
    var suma = 0
    var nDatos = 0 //Comprobamos la cantidad de datos leidos
    this.dayLectures.map(lectura =>{
      if(lectura != null){
        nDatos += 1
        suma += lectura!
      }
    })
    if(nDatos > 0){
      return (suma/nDatos).toFixed(2) + '° C'
    }else{
      return "Sin datos."
    }
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
