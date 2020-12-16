var express = require('express');
var ruta = express.Router();
var request = require('request');

var mensaje = '';

ruta.get('/', function (req, res, next) {
    request.get("https://microserviciospeliculas.herokuapp.com/directores", (error, response, body) => {
        mensaje = '';
        if (error) {
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log(JSON.parse(body));
        res.render('directores/index', {
            mensaje: mensaje,
            title: 'Listado de directores',
            data: JSON.parse(body)
        });
    });
});

ruta.get('/add', (req, res) => {
    mensaje = 'Agregando Director';
    res.render('directores/add', {
        mensaje: mensaje,
        title: 'Agregar un director',
        Id_Director: '',
        Nombre: '',
        Apellidos: '',
        Nacionalidad: '',
        Premios: ''
    });
});

ruta.post('/add', function (req, res, next) {
    let Id_Director = req.body.Id_Director;
    let Nombre = req.body.Nombre;
    let Apellidos = req.body.Apellidos;
    let Nacionalidad = req.body.Nacionalidad;
    let Premios = req.body.Premios;

    let errors = false;

    if (!errors) {
        var datosForma = {
            Id_Director: Id_Director,
            Nombre: Nombre,
            Apellidos: Apellidos,
            Nacionalidad: Nacionalidad,
            Premios: Premios
        }

        request.post({ url: "https://microserviciospeliculas.herokuapp.com/directores", json: datosForma }, (error, response, body) => {
            mensaje = 'El director se ha agregado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/directores');
        });
    }
});
//Despliega pantalla para Modificar Estudiante
ruta.get('/update/:Id_Director', (req, res) => {
    Id_Director = req.params.Id_Director;
    mensaje = 'Modificando director con id ' + Id_Director;
    console.log(mensaje);
    var DirectorFind;
    //Busca si existe el estudiante de acuerdo al número de control
    URI = "https://microserviciospeliculas.herokuapp.com/directores/" + Id_Director;
    console.log('URI: ' + URI);
    request.get(URI, (error, response, body) => {
        mensaje = '';
        if (error) { //En caso de que surja un error
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log("Director Encontrado ===>");
        console.log(body);
        //Despliega pantalla para modificar de Estudiante
        res.render('directores/edit', {
            mensaje: mensaje,
            title: 'Modificando Director', //Título de la página
            Id_Director: JSON.parse(body).Id_Director, //Datos de Estudiante
            Nombre: JSON.parse(body).Nombre,
            Apellidos: JSON.parse(body).Apellidos,
            Nacionalidad: JSON.parse(body).Nacionalidad,
            Premios: JSON.parse(body).Premios
        });
    });
});

// Modificando un nuevo estudiante a través del Microservicio
ruta.post('/update', function (req, res, next) {
    console.log('Modificando un Director');
    //Extrae los datos enviados por la forma
    let Id_Director = req.body.Id_Director;
    let Nombre = req.body.Nombre;
    let Apellidos = req.body.Apellidos;
    let Nacionalidad = req.body.Nacionalidad;
    let Premios = req.body.Premios;
    let errors = false;
    // Si no hay errores
    if (!errors) {
        //Encapsula datos provenientes de la forma
        var datosForma = {
            Id_Director: Id_Director,
            Nacionalidad: Nacionalidad,
            Premios: Premios
        }
        //Invoca al Microservicio de modificar
        request.put({ url: "https://microserviciospeliculas.herokuapp.com/directores", json: datosForma },
            (error, response, body) => {
                mensaje = 'El director se ha modificado con éxito';
                if (error) {
                    console.log(error);
                    mensaje = 'Error: ' + error;
                }
                console.log(response);
                res.redirect('/directores'); //Redirige a Listado de Estudiantes
            });
    }
});

ruta.get('/delete/:Id_Director', (req, res) => {
    Id_Director = req.params.Id_Director;
    mensaje = 'Eliminando director con id ' + Id_Director;
    console.log(mensaje);
    if (Id_Director) {
        //Invoca al Microservicio
        URI = "https://microserviciospeliculas.herokuapp.com/directores/" + Id_Director;
        request.delete(URI, (error, response, body) => {
            mensaje = 'El director se ha eliminado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/directores'); //Redirige a Listado de Estudiantes
        });
    }
});


module.exports = ruta;