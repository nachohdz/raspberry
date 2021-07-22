import pyrebase
import datetime
import time
import random

#Configuración y conexión con Firebase
config = {
  "apiKey": "AIzaSyACCZaXK5A-VYK6bGGIFI2PPKArgi5AGiA",
  "authDomain": "raspberry-acbe7.firebaseapp.com",
  "databaseURL": "https://raspberry-acbe7-default-rtdb.firebaseio.com",
  "projectId": "raspberry-acbe7",
  "storageBucket": "raspberry-acbe7.appspot.com",
  "messagingSenderId": "673906784564",
  "appId": "1:673906784564:web:ceef3bfdf6ae922e340d61",
  "measurementId": "G-SYK5LS8XBP"
}

firebase = pyrebase.initialize_app(config)
database = firebase.database()

#Bandera que evite que se envíen duplicados, pues la revisión es cada medio segundo
banHora = True

while True:
    #el ciclo es cada medio segundo para evitar pérdidas en las lecturas
    time.sleep(0.5)
    #obteniendo la hora actual
    current_time = datetime.datetime.now()
    hour = current_time.strftime("%H:%M")
    date = current_time.strftime("%d%m%Y")
    minute = current_time.strftime("%M:%S")
    #ATENCIÓN: reemplazar con temperatura real
    temp = random.randint(18, 27)
    #si estamos en el minuto 00:00 es una nueva hora
    print(current_time)
    if(minute == "00:00" and banHora):
        banHora = False
        database.child("lecturas").child(date + hour)
        data= {"fecha": date, "hora": hour, "temperatura":temp}
        database.set(data)
    else:
        banHora = True
