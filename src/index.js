//-----------------SERVIDOR-------------------
const express  = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const router = require('./router');

const port = 3000;
const messages = [] //Aca se almacenan los mensajes

const app = express(); //SERVIDOR HTTP -> PARA API'S
                        //usa el app.listen(port, ()=>{}) para abrir el servidor

app.use(express.json());    //Midleware para leer JSON y convertirlo a JS
app.use(express.static(__dirname + '/public')) //Midleware para usar archivos estaticos, ejemplo: styles.css

router(app) //Ejecuta la funcion de la carpeta router

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname +  '/views');

const httpServer = app.listen(port, ()=>{  console.log("Server running at port " + port);});

const io = new Server(httpServer); //SERVIDOR WEBSOCKETS -> Para realTime
                                    //Usa io.on('connection', ()=>{}) para abrir el servidor


io.on('connection', (socket)=>{
    console.log('Cliente conectado con id: ' + socket.id); //Mensaje en consola de VSCode =  SERVIDOR

    socket.on('newUser', user =>{
        socket.broadcast.emit('userConnected', user)
        socket.emit('messageLogs', messages)
    })

    //SERVIDOR ESCUCHA
    socket.on('message', (data) =>{ //'message' es el mismo metodo que tenemos del lado del cliente
        messages.push(data)
        io.emit('messageLogs', messages) //SERVIDOR EMITE A ¡¡TODOS!! los clientes
    })
})
