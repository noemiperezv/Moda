function iniciarMap(){

	function localizacion(posicion){
		var latitude = posicion.coords.latitude;
		var longitude = posicion.coords.longitude;
		var coord = {lat:latitude ,lng: longitude};
	    var map = new google.maps.Map(document.getElementById('map'),{
	      zoom: 10,
	      center: coord
	    });
	    var marker = new google.maps.Marker({
	      position: coord,
	      map: map
	    });
	}

	function error(){
		output.innerHTML = "<p>No se pudo obtener tu ubicación</p>";

	}
	navigator.geolocation.getCurrentPosition(localizacion,error);

}