var express = require('express');
var ruta = express.Router();
var request = require('request');

var mensaje = '';

ruta.get('/', function (req, res, next) {
    request.get("https://microserviciospeliculas.herokuapp.com/actores/", (error, response, body) => {
        mensaje = '';
        if (error) {
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log(JSON.parse(body));
        res.render('actores/index', {
            mensaje: mensaje,
            title: 'Listado de actores',
            data: JSON.parse(body)
        });
    });
});

ruta.get('/add', (req, res) => {
    mensaje = 'Agregando Actor';
    res.render('actores/add', {
        mensaje: mensaje,
        title: 'Agregar un actor',
        Id_Actor: '',
        Nombre: '',
        Apellidos: '',
        Edad: '',
        Nacionalidad: '',
        AñoInicio:''
    });
});

ruta.post('/add', function (req, res, next) {
    let Id_Actor = req.body.Id_Actor;
    let Nombre = req.body.Nombre;
    let Apellidos = req.body.Apellidos;
    let Edad = req.body.Edad;
    let Nacionalidad = req.body.Nacionalidad;
    let AñoInicio = req.body.AñoInicio;

    let errors = false;

    if (!errors) {
        var datosForma = {
            Id_Actor: Id_Actor,
            Nombre: Nombre,
            Apellidos: Apellidos,
            Edad: Edad,
            Nacionalidad: Nacionalidad,
            AñoInicio: AñoInicio
        }

        request.post({ url: "https://microserviciospeliculas.herokuapp.com/actores", json: datosForma }, (error, response, body) => {
            mensaje = 'El actor se ha agregado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/actores');
        });
    }
});
//Despliega pantalla para Modificar Estudiante
ruta.get('/update/:Id_Actor', (req, res) => {
    Id_Actor = req.params.Id_Actor;
    mensaje = 'Modificando actor con id ' + Id_Actor;
    console.log(mensaje);
    var ActorFind;
    //Busca si existe el estudiante de acuerdo al número de control
    URI = "https://microserviciospeliculas.herokuapp.com/actores/" + Id_Actor;
    console.log('URI: ' + URI);
    request.get(URI, (error, response, body) => {
        mensaje = '';
        if (error) { //En caso de que surja un error
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log("ActorEncontrado ===>");
        console.log(body);
        //Despliega pantalla para modificar de Estudiante
        res.render('actores/edit', {
            mensaje: mensaje,
            title: 'Modificando Actor', //Título de la página
            Id_Actor: JSON.parse(body).Id_Actor, //Datos de Estudiante
            Nombre: JSON.parse(body).Nombre,
            Apellidos: JSON.parse(body).Apellidos,
            Edad: JSON.parse(body).Edad,
            Nacionalidad: JSON.parse(body).Nacionalidad,
            AñoInicio: JSON.parse(body).AñoInicio
        });
    });
});

// Modificando un nuevo estudiante a través del Microservicio
ruta.post('/update', function (req, res, next) {
    console.log('Modificando un Actor');
    //Extrae los datos enviados por la forma
    let Id_Actor = req.body.Id_Actor;
    let Nombre = req.body.Nombre;
    let Apellidos = req.body.Apellidos;
    let Edad = req.body.Edad;
    let Nacionalidad = req.body.Nacionalidad;
    let AñoInicio = req.body.AñoInicio;
    let errors = false;
    // Si no hay errores
    if (!errors) {
        //Encapsula datos provenientes de la forma
        var datosForma = {
            Id_Actor: Id_Actor,
            Edad: Edad,
            Nacionalidad: Nacionalidad,
            AñoInicio: AñoInicio
        }
        //Invoca al Microservicio de modificar
        request.put({ url: "https://microserviciospeliculas.herokuapp.com/actores", json: datosForma },
            (error, response, body) => {
                mensaje = 'El actor se ha modificado con éxito';
                if (error) {
                    console.log(error);
                    mensaje = 'Error: ' + error;
                }
                console.log(response);
                res.redirect('/actores'); //Redirige a Listado de Estudiantes
            });
    }
});

ruta.get('/delete/:Id_Actor', (req, res) => {
    Id_Actor = req.params.Id_Actor;
    mensaje = 'Eliminando Actor con id ' + Id_Actor;
    console.log(mensaje);
    if (Id_Actor) {
        //Invoca al Microservicio
        URI = "https://microserviciospeliculas.herokuapp.com/actores/" + Id_Actor;
        request.delete(URI, (error, response, body) => {
            mensaje = 'El actor se ha eliminado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/actores'); //Redirige a Listado de Estudiantes
        });
    }
});


module.exports = ruta;