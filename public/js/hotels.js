var heading = sessionStorage.heading; //webstorage
let a = {
	'Trending Now' : {support : 'Trending restaurants in town', image :'./pics/1440/corn-flakes_xl.jpg'},
	'Most Visited' : {support : 'Most visited restaurants in town', image :'./pics/1440/steak_dinner_xl.jpg'},
	'Newly Opened' : {support : 'Newly opened restaurants in town', image :'./pics/1440/cake_xl.jpg'},
	'High Rated'   : {support : 'High rated restaurants in town', image :'./pics/1440/fish_soup_xl.jpg'},
	'Breakfast' : {support : 'Showing restaurants special in Breakfast', image : './pics/1440/breakfast_xl.jpeg'},
	'Dinner' : {support : 'Showing restaurants special in Dinner', image : './pics/1440/dinner_xl.jpeg'},
	'Desserts' : {support : 'Showing restaurants special in Desserts', image : './pics/1440/brownie_xl.jpeg'},
	'Lunch' : {support : 'Showing restaurants special in Lunch' , image : './pics/1440/lunch_xl.jpeg'},
	'Cafe' : {support : 'Showing best Cafes around you!', image : './pics/1440/cafe_xl.jpeg'},
	'Wines & beverages' : {support : 'Showing Bars & Pubs around you!', image : './pics/1440/wines_xl.jpeg'}
}

$("#change_head").text(heading);
$("#change_support_text").text(a[heading].support);
$(".image-container").css("background-image", "url("+a[heading].image+")");

var dbref = firebase.database().ref();
var childnode = dbref.child('resId');

var elements = function(d,g) {   
	var main_div = $('.grid2');
	var mdl_cell = $('<div/>').addClass('mdl-cell mdl-cell--4-col');
	var mdl_card = $('<div/>').addClass('mdl-card mdl-shadow--2dp');
	var	mdl_card_media = $('<div/>').addClass('mdl-card__media');
	var mdl_card_title = $('<div/>').addClass('mdl-card__title');
	var mdl_card_title_h4 = $('<h4/>').addClass('mdl-card__title-text');
	var mdl_card_support = $('<div/>').addClass('mdl-card__supporting-text');

	main_div.append(mdl_cell);
	mdl_cell.append(mdl_card);
	mdl_card.append(mdl_card_media);
	mdl_card.append(mdl_card_title);
	mdl_card_title.append(mdl_card_title_h4);
	mdl_card.append(mdl_card_support);
	mdl_card_media.css("background-image", "url("+g+")");
	var dataAddr =  d.id.address.split(',');
	mdl_card_title_h4.text(d.id.resName);
	mdl_card_support.text(dataAddr[0] +' '+dataAddr[1]);

}

var getImage = (data) =>{			
	var image_url = './pics/hotels/'+data.id.image;
	fetch(image_url).then(res=>{
		if(res.ok){
			return res.blob();
		}
		throw new error ('requested image not available');
	}).then(blob =>{
		var blobUrl = URL.createObjectURL(blob);
	    var image_path = blobUrl;
	    elements(data, image_path);
	}).catch(err =>{
		console.log('error fetching the image '+ err.message);
	});
}

/*--------------Displaying restaurants using function ---------------*/

$(document).ready(function(){

	var key = [];
	(() => {
	childnode.once('value').then(snap => {
		snap.forEach( snapchild => {
			var id = snapchild.key;
			var content = snapchild.val();
			var myobj = { 
				id : content
			}
			key.push(myobj);
		});
		displayData(key);
		localStorage.setItem('key', JSON.stringify(key));
	});
	})();

	
	var displayData = (e) => {
		var heading = sessionStorage.getItem('heading');
		if(e){
		e.forEach((i)=>{
			 
			if( heading === 'High Rated' && i.id.rating >= 4.1){
				getImage(i);	
			}else if(heading === 'Trending Now' && i.id.rating >= 4.3 ){
				getImage(i);
			}else if (heading === 'Newly Opened' && i.id.since > 2012){
				getImage(i);
			}else if(heading === 'Most Visited'){
				getImage(i);
			}else if(heading === 'Breakfast'){
				var meal = i.id.mealType.split(',');
				meal.forEach((l) => {
					if(l == heading){
						getImage(i);
					}
				});
			}else if(heading === 'Dinner') {
				var meal = i.id.mealType.split(',');
				var x=0;
				meal.forEach((l) => {
					if(l == heading){
						x++;
					}else if(l == 'After-hours'){
						x++;
					}
				});
				if(x==1 || x==2){
					getImage(i);
				}
			}else if (heading === 'Desserts') {
				var meal = i.id.mealType.split(',');
				meal.forEach((l) => {
					if(l == heading){
						getImage(i);
					}
				});

			}else if (heading === 'Lunch'){
				var meal = i.id.mealType.split(',');
				meal.forEach((l) => {
					if(l == heading){
						getImage(i);
					}
				});

			}else if (heading === 'Cafe'){
				var meal = i.id.mealType.split(',');
				meal.forEach((l) => {
					if (l == 'Brunch') {
						getImage(i);
					}
				});

			}else if (heading === 'Wines & beverages'){
				var meal = i.id.mealType.split(',');
				meal.forEach((l) => {
					if(l == 'Beverage'){
						getImage(i);
					}
				});
			} else {
				console.log('error selecting restaurants');
			} 
		});
		}	
	}

	$(".search-container").hide();
	$(".toggle_search").click(function(){
		$(".search-container").slideToggle();
		$(".search_close").hide();
	});
	$(".mdl-layout__header-row").click(function(e){
		e.stopPropagation();
	});
	$(".search-container").click(function(e){
		e.stopPropagation();
	});
	$(document).click(function(){
		$(".search-container").hide();
	});

	$(".search input").keypress(function() {
		$(".search_close").show();
	});

	$(".prev_search,.search_close").click(function() {
		$(".search-container").hide();
	});

	$(".prev_page").click(function(){
		parent.history.back();
	});

	$(".x-rate li").click(function() {
        $(".x-rate li").removeClass('color-1');
        $(".x-rate li").removeClass('color-2');
        $(this).addClass('color-1');
        $(this).prevAll().addClass('color-2');
    });
});

































