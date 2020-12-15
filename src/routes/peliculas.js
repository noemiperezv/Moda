var express = require('express');
var ruta = express.Router();
var request = require('request');

var mensaje = '';
var data1 = [];
var data2 = [];

ruta.get('/', function (req, res, next) {
    request.get("https://microserviciospeliculas.herokuapp.com/peliculas", (error, response, body) => {
        mensaje = '';
        if (error) {
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log(JSON.parse(body));
        res.render('peliculas/index', {
            mensaje: mensaje,
            title: 'Listado de peliculas',
            data: JSON.parse(body)
        });
    });
});

ruta.get('/add', (req, res) => {
    mensaje = 'Agregando Pelicula';
    request.get("https://microserviciospeliculas.herokuapp.com/directores",(error, response, body) =>{

    mensaje = '';
    if(error){
        console.log(error);
        mensaje = 'Error: ' + error;
    }
    data1 = JSON.parse(body);
    console.log(data1);
    });

    request.get("https://microserviciospeliculas.herokuapp.com/actores", (error, response, body) =>{

    mensaje = '';
    if (error){
        console.log(error);
        mensaje = 'Error: ' + error;
    }

    data2 = JSON.parse(body);
    console.log(data2);
    });
    res.render('peliculas/add', {
        mensaje: mensaje,
        title: 'Agregar una pelicula',
        Id_Pelicula: '',
        Titulo: '',
        Nombre_Director: '',
        Nombre_Actor: '',
        Año:'',
        Categoria: '',
        datos1: data1,
        datos2: data2
    });
});

ruta.post('/add', function (req, res, next) {
    let Id_Pelicula = req.body.Id_Pelicula;
    let Titulo = req.body.Titulo;
    let Nombre_Director = req.body.Nombre_Director;
    let Nombre_Actor = req.body.Nombre_Actor;
    let Año = req.body.Año;
    let Categoria = req.body.Categoria;
    

    let errors = false;

    if (!errors) {
        var datosForma = {
            Id_Pelicula: Id_Pelicula,
            Titulo: Titulo,
            Nombre_Director: Nombre_Director,
            Nombre_Actor: Nombre_Actor,
            Año:Año,
            Categoria: Categoria
            
        }

        request.post({ url: "https://microserviciospeliculas.herokuapp.com/peliculas", json: datosForma }, (error, response, body) => {
            mensaje = 'La película se ha agregado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/peliculas');
        });
    }
});
//Despliega pantalla para Modificar Estudiante
ruta.get('/update/:Id_Pelicula', (req, res) => {
    Id_Pelicula = req.params.Id_Pelicula;
    mensaje = 'Modificando peliícula con id: ' + Id_Pelicula;
    console.log(mensaje);
    var PeliculaFind;
    //Busca si existe el estudiante de acuerdo al número de control
    URI = "https://microserviciospeliculas.herokuapp.com/peliculas/" + Id_Pelicula;
    console.log('URI: ' + URI);
    request.get(URI, (error, response, body) => {
        mensaje = '';
        if (error) { //En caso de que surja un error
            console.log(error);
            mensaje = 'Error: ' + error;
        }
        console.log("Película encontrada ===>");
        console.log(body);
        //Despliega pantalla para modificar de Estudiante
        res.render('peliculas/edit', {
            mensaje: mensaje,
            title: 'Modificando Película', //Título de la página
            Id_Pelicula: JSON.parse(body).Id_Pelicula, //Datos de Estudiante
            Titulo: JSON.parse(body).Titulo,
            Nombre_Director: JSON.parse(body).Nombre_Director,
            Nombre_Actor: JSON.parse(body).Nombre_Actor,
            Año: JSON.parse(body).Año,
            Categoria: JSON.parse(body).Categoria
            
        });
    });
});

// Modificando un nuevo estudiante a través del Microservicio
ruta.post('/update', function (req, res, next) {
    console.log('Modificando una Película');
    //Extrae los datos enviados por la forma
    let Id_Pelicula = req.body.Id_Pelicula;
    let Titulo= req.body.Titulo;
    let Nombre_Director = req.body.Nombre_Director;
    let Nombre_Actor = req.body.Nombre_Actor;
    let Categoria = req.body.Categoria;
    let Año= req.body.Año;
    
    
    let errors = false;
    // Si no hay errores
    if (!errors) {
        //Encapsula datos provenientes de la forma
        var datosForma = {
            Id_Pelicula: Id_Pelicula,
            Categoria: Categoria,
            Año: Año
           
        }
        //Invoca al Microservicio de modificar
        request.put({ url: "https://microserviciospeliculas.herokuapp.com/peliculas", json: datosForma },
            (error, response, body) => {
                mensaje = 'La película se ha modificado con éxito';
                if (error) {
                    console.log(error);
                    mensaje = 'Error: ' + error;
                }
                console.log(response);
                res.redirect('/peliculas'); //Redirige a Listado de Estudiantes
            });
    }
});

ruta.get('/delete/:Id_Pelicula', (req, res) => {
    Id_Pelicula = req.params.Id_Pelicula;
    mensaje = 'Eliminando película con el id: ' + Id_Pelicula;
    console.log(mensaje);
    if (Id_Pelicula) {
        //Invoca al Microservicio
        URI = "https://microserviciospeliculas.herokuapp.com/peliculas/" + Id_Pelicula;
        request.delete(URI, (error, response, body) => {
            mensaje = 'La película se ha eliminado con éxito';
            if (error) {
                console.log(error);
                mensaje = 'Error: ' + error;
            }
            console.log(response);
            res.redirect('/peliculas'); //Redirige a Listado de Estudiantes
        });
    }
});


module.exports = ruta;