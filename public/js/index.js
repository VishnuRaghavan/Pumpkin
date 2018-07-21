$(document).ready(function(){
	$(".collection").click(function() {
		sessionStorage.clear();
		var heading = $(this).find("h4").text();
		sessionStorage.setItem("heading", heading); 
		$(location).attr('href','/hotels.html');
	});

	$(".mdl-grid.grid2").on("click", ".mdl-cell.mdl-cell--4-col" ,function() {
		var res_card = $(this).find("h4").text();
		sessionStorage.setItem("res-name", res_card);
		$(location).attr('href','/restaurant.html');
	});

	$("#quicksearch > a").click(function() {
		sessionStorage.clear();
		var heading = $(this).find("h5").text();
		sessionStorage.setItem('heading', heading);
		$(location).attr('href','/hotels.html');
	});

	$("#search425").keyup(() => {
		clearTimeout(debounce);
		var debounce = setTimeout(() =>{

			$('.searchMenu').show().html('');
			var searchData = $("#search425").val();
			var expression = new RegExp(searchData, "i");
			const storedArray = JSON.parse(localStorage.getItem('key'));
			const names = [];
			storedArray.forEach((i)=>{
				names.push(i.id.resName);
			});

			var showData = (data) => {
				var li = $('<li/>');
				li.addClass('searchli');
				li.text(data);
				$('.searchMenu').append(li);
				$('.searchMenu').on('click', 'li', (e) => {
					var b = $(e.currentTarget).text();
					sessionStorage.setItem('search', b);
					$(location).attr('href','/restaurant.html');
				});
				// console.log(data);
			}

			names.forEach((j)=>{
				if(searchData) {
					if(j.search(expression) != -1 ) {		
						showData(j);
					}
				}
				else {
					$('.searchMenu').hide();
				}
			});

		}, 400);
	});

});

var display = (data) => {
	var resCard = $('.res-card');
	resCard.children('.mdl-card__title').find('h4').text(data.id.resName);
	resCard.children('.mdl-card__supporting-text').text(data.id.cusines);
	Getlatitude = data.id.latitude;
	Getlongitude = data.id.longitude;
	var resGrid = $('.res-grid');
	resGrid.find('.details-contact').children('p').text(data.id.phone);
	resGrid.find('.details-email').children('p').text(data.id.email);
	resGrid.find('.details-addr').children('p').text(data.id.address);
	resGrid.find('.details-food-type').children('p').text(data.id.mealType);
	resGrid.find('.details-res-hr').children('.hour').text(data.id.openingHours);
}

var restoken = sessionStorage.getItem('res-name');
var searchtoken = sessionStorage.getItem('search'); 
var Getlatitude;
var Getlongitude;
if(restoken || searchtoken) {
	(() => {
		var storedArray = JSON.parse(localStorage.getItem('key'));
		storedArray.forEach((i) => {
			if(restoken == i.id.resName || searchtoken == i.id.resName){
				var image_url = './pics/hotels/'+i.id.image;
				fetch(image_url).then(res=>{
					if(res.ok){
						return res.blob();
					}
					throw new error ('requested image not available');
				}).then(blob =>{
					var blobUrl = URL.createObjectURL(blob);
					var image_path = blobUrl;
					$(".restaurant_img").css("background-image","url("+image_path+")");
				}).catch(err =>{
					console.log('error fetching the image '+ err.message);
				});
				
				display(i);

				}
			}); 
	})();
}


/*code for map in restaurants page*/
function init() {
	if(navigator.geolocation){		
		if(Getlatitude && Getlongitude){
			var lat = Getlatitude;
			var lng = Getlongitude;
			mapinit(lat, lng);
		}
	}else {
		alert('Geolocation not supported by your Browser');
	}
}


function mapinit(x , y) {
	var coord = {lat: x, lng: y};
	var map_contain = document.getElementById("map");
	var map_options = {zoom: 17, center: coord};
	var map = new google.maps.Map(map_contain, map_options);
	var marker_option = {position: coord, map: map};
	var marker = new google.maps.Marker(marker_option);
}

//code for front page map in index page 

function showposition(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	initMap(latitude, longitude);
}

		
function locateMe() {
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showposition);
	}else {
		console.log('Geolocation not supported by your Browser');
	}
}

var map;
var infowindow;

function initMap(x,y) {
	var pyrmont = {lat: x, lng: y};

	map = new google.maps.Map(document.getElementById('local'), {
		center: pyrmont,
		zoom: 15
	});

	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: pyrmont,
		radius: 500,
		type: ['restaurant']
	}, callback);
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}
// code for map ends


 











