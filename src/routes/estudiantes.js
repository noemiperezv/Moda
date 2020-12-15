var express = require('express');
var ruta = express.Router();
var request = require('request');

var mensaje = '';

ruta.get('/', function (req, res, next) {
    request.get("https://microserviciospeliculas.herokuapp.com/estudiantes/", (error, response, body) => {
        mensaje = '';
        if (error) {
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log(JSON.parse(body));
        res.render('estudiantes/index', {
            mensaje: mensaje,
            title: 'Listado de estudiantes',
            data: JSON.parse(body)
        });
    });
});

ruta.get('/add', (req, res) => {
    mensaje = 'Agregando Estudiante';
    res.render('estudiantes/add', {
        mensaje: mensaje,
        title: 'Agregar un estudiante',
        NumeroControl: '',
        Nombre: '',
        Apellidos: '',
        Edad: '',
        Email: ''
    });
});

ruta.post('/add', function (req, res, next) {
    let NumeroControl = req.body.NumeroControl;
    let Nombre = req.body.Nombre;
    let Apellidos = req.body.Apellidos;
    let Edad = req.body.Edad;
    let Email = req.body.Email;

    let errors = false;

    if (!errors) {
        var datosForma = {
            NumeroControl: NumeroControl,
            Nombre: Nombre,
            Apellidos: Apellidos,
            Edad: Edad,
            Email: Email
        }

        request.post({ url: "https://microserviciospeliculas.herokuapp.com/estudiantes", json: datosForma }, (error, response, body) => {
            mensaje = 'El dato se ha agregado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/estudiantes');
        });
    }
});
//Despliega pantalla para Modificar Estudiante
ruta.get('/update/:NumeroControl', (req, res) => {
    NumeroControl = req.params.NumeroControl;
    mensaje = 'Modificando Estudiante con Número de Control ' + NumeroControl;
    console.log(mensaje);
    var EstudianteFind;
    //Busca si existe el estudiante de acuerdo al número de control
    URI = "https://microserviciospeliculas.herokuapp.com/estudiantes/" + NumeroControl;
    console.log('URI: ' + URI);
    request.get(URI, (error, response, body) => {
        mensaje = '';
        if (error) { //En caso de que surja un error
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log("Estudiante Encontrado ===>");
        console.log(body);
        //Despliega pantalla para modificar de Estudiante
        res.render('estudiantes/edit', {
            mensaje: mensaje,
            title: 'Modificando Estudiante', //Título de la página
            NumeroControl: JSON.parse(body).NumeroControl, //Datos de Estudiante
            Nombre: JSON.parse(body).Nombre,
            Apellidos: JSON.parse(body).Apellidos,
            Edad: JSON.parse(body).Edad,
            Email: JSON.parse(body).Email
        });
    });
});

// Modificando un nuevo estudiante a través del Microservicio
ruta.post('/update', function (req, res, next) {
    console.log('Modificando un Estudiante');
    //Extrae los datos enviados por la forma
    let NumeroControl = req.body.NumeroControl;
    let Nombre = req.body.Nombre;
    let Apellidos = req.body.Apellidos;
    let Edad = req.body.Edad;
    let Email = req.body.Email;
    let errors = false;
    // Si no hay errores
    if (!errors) {
        //Encapsula datos provenientes de la forma
        var datosForma = {
            NumeroControl: NumeroControl,
            Nombre: Nombre,
            Apellidos: Apellidos
        }
        //Invoca al Microservicio de modificar
        request.put({ url: "https://microserviciospeliculas.herokuapp.com/estudiantes", json: datosForma },
            (error, response, body) => {
                mensaje = 'El dato se ha modificado con éxito';
                if (error) {
                    console.log(error);
                    mensaje = 'Error: ' + error;
                }
                console.log(response);
                res.redirect('/estudiantes'); //Redirige a Listado de Estudiantes
            });
    }
});

ruta.get('/delete/:NumeroControl', (req, res) => {
    NumeroControl = req.params.NumeroControl;
    mensaje = 'Eliminando Estudiante con Número de Control ' + NumeroControl;
    console.log(mensaje);
    if (NumeroControl) {
        //Invoca al Microservicio
        URI = "https://microserviciospeliculas.herokuapp.com/estudiantes/" + NumeroControl;
        request.delete(URI, (error, response, body) => {
            mensaje = 'El dato se ha eliminado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/estudiantes'); //Redirige a Listado de Estudiantes
        });
    }
});


module.exports = ruta;