
var cacheName = 'v2';
var cacheFiles = [
	'./',
	'./index.html',
	'./hotels.html',
	'./restaurant.html',
	'./mdl/material.min.css',
	'./mdl/material.min.js',
	'./css/flickity.css',
	'./css/hotels.css',
	'./css/login.css',
	'./css/style.css',
	'./js/flickity.pkgd.min.js',
	'./js/hotels.js',
	'./js/index.js',
	'./js/jquery-3.2.1.min.js',
	'./js/login.js',
	'./manifest.json',
	'/pics/1440/cake_xl.jpg',
	'./pics/1440/corn-flakes_xl.jpg',
	'./pics/1440/fish_soup_xl.jpg',
	'./pics/1440/header_xl.jpg',
	'./pics/1440/steak_dinner_xl.jpg',
	'./pics/1440/logo-1440.png',
	'./pics/1440/brownie_xl.jpeg',
	'./pics/icons/breakfast.png',
	'./pics/icons/cafe.png',
	'./pics/icons/call-answer.png',
	'./pics/icons/close-envelope.png',
	'./pics/icons/deserts.png',
	'./pics/icons/dinner.png',
	'./pics/icons/fb-login.png',
	'./pics/icons/fb.png',
	'./pics/icons/google-login.png',
	'./pics/icons/instagram.png',
	'./pics/icons/lunch.png',
	'./pics/icons/twitter.png',
	'./pics/icons/wine.png',
	'./pics/icons/192-x-192.png',
	'./pics/icons/256-x-256.png',
	'./pics/icons/512-x-512.png'
];





self.addEventListener('install', e => {
	console.log('SERVICE WORKER INSTALLED');
	e.waitUntil(
		caches.open(cacheName).then(cache=>{
		console.log('SERVICE WORKER CACHING THE CACHE FILES');
		return cache.addAll(cacheFiles);
	}));
});



self.addEventListener('activate', e => {
	console.log('SERVICE WORKER ACTIVATED');
	e.waitUntil(

		caches.keys().then(cacheNames=>{
			return Promise.all(cacheNames.map(thisCacheName=>{

				if(thisCacheName !== cacheName){
					console.log("SERVICE WORKER IS REMOVING CACHE FIELS ", thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	);
});



self.addEventListener('fetch', e => {
	console.log('SERVICE WORKER FETCHING', e.request.url);
	e.respondWith(
		caches.match(e.request).then(response=>{
			if(response){
				console.log('SERVICE WORKER FOUND FILES IN CACHE ', e.request.url);
				return response;
			}
			var requestClone = e.request.clone();
			fetch(requestClone).then(response=>{
				if(!response){
					console.log('THE SERVICE WORKER GOT NO RESPONSE FROM FETCH');
					return response;
				}
				var responseClone = response.clone();
				caches.open(cacheName).then(cache=>{
					cache.put(e.request, responseClone);
					return response;
				});

			}).catch(error=>{
				console.log('SERVICE WORKER CANNOT FETCH & CACHE FROM SERVER');
			});
		})
	);
});

















