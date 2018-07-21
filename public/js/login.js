// checking browser compatibility service workers
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js').then(function(){
		console.log('registered successfully');
	}).catch(function(err){
		console.log('not registered error', err);
	});
}

//basic login js functionalities
var social = $('.modal_form');
var login = $('.modal_form_login');
var register = $('.modal_form_register');

$(document).ready(function(){

	start();

	$('a.login').click(function(){
		$('.overlay_form').fadeIn().css("display","flex");
		social.show();
		login.hide();
		register.hide();
		return false;
	});

	$('span.close').click(function(){
		$('.overlay_form').fadeOut();
	});

	$(document).click(function(){
		$('.overlay_form').fadeOut();
	});

	$('form').click(function(e){
		e.stopPropagation();
	})

	$('button#login').click(function(){
		login.show();
		social.hide();
		register.hide();
		return false;
	});

	$('button.back').click(function(){
		social.show();
		login.hide();
		register.hide();
		return false;
	});

	$('button#signup, .modal_form_login .signup-text a').click(function(){
		register.show();
		login.hide();
		social.hide();
		return false;
	});

	$('.signup-text-login a').click(function(){
		register.hide();
		login.show();
		social.hide();
		return false;
	});

	$('nav a.createaccount').click(function(){
		$('.overlay_form').fadeIn().css("display","flex");
		social.hide();
		login.hide();
		register.show();
		return false;
	});

	$('div.icon-login').click(function(){
		$('.overlay_form').fadeIn().css("display","flex");
		social.show();
		login.hide();
		register.hide();
		return false;
	});

});


var config = {
    apiKey: "AIzaSyDVw6ARAqk5aOJqNaoMyabEaH2acCK8AXs",
    authDomain: "can-store-eb698.firebaseapp.com",
    databaseURL: "https://can-store-eb698.firebaseio.com",
    projectId: "can-store-eb698",
    storageBucket: "can-store-eb698.appspot.com",
    messagingSenderId: "542084759539"
  };
firebase.initializeApp(config);
  
var google = document.getElementById('Gl-id');
var facebook = document.getElementById('fb-id');
var signOut = document.getElementById('signOut');
var spinner = $('.mdl-spinner');
var Img = $('#gImg');
var Img1 = $('#gImg1');
var mail = $('#gName');
var userName;
var userEmail;
var userID;
var userImage;
var flag;
// adding click event

google.addEventListener('click', ()=>{signIn_gl();});
facebook.addEventListener('click', ()=>{signIn_fb();});
signOut.addEventListener('click', ()=>{logOut();});

var setSessionFlag = () => {
	flag = 1;
	sessionStorage.setItem('flag', flag);
	}

var signIn_gl = () => {
	setSessionFlag();
	if(!firebase.auth().currentUser){
		// get provider
		var provider = new firebase.auth.GoogleAuthProvider();
			provider.addScope('profile');
 			provider.addScope('email');
 			provider.addScope('https://www.googleapis.com/auth/plus.me');
		// signIn with redirect
		firebase.auth().signInWithRedirect(provider);

	}else{
		console.log('signing out');
	}
}

var signIn_fb = () => {
	setSessionFlag();
	if(!firebase.auth().currentUser){
		//get provider 
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_birthday');
		provider.addScope('email');
		//  signIn with redirect 
		firebase.auth().signInWithRedirect(provider);
	}else {
		console.log('signing out');
	}
}


var logOut = () => {
	sessionStorage.removeItem('flag');
	firebase.auth().signOut().then(()=>{
		style_signed_out();
	}).catch(err => {
		console.log(err);
	});	
}

var start = () => {
	// result from redirect
	var temp = sessionStorage.flag;
	if(temp == 1){
		$('#ac-p').hide();
		spinner.show();
	}
	
	firebase.auth().getRedirectResult().then(result => {
		if(result.credential){
			var token = result.credential.accessToken;
		}
		var User = result.user;
		spinner.hide();
		
	}).catch(err => {
		var errorCode = err.code;
		var errorMessage = err.message;
		var errorEmail = err.email;
		var errorCredential = err.credential;
		if(errorCode === 'auth/account-exists-with-different-credential'){
			console.log('signed up with a different auth provider for that email');
			// firebase.auth.fetchProvidersForEmail(errorEmail).then(providers => {
			// 	firebase.auth().signInWithCredential(result.credential).then(user =>{
			// 		user.link(errorCredential);
			// 	}).catch(err =>{
			// 		console.log(err.message);
			// 	});
			// });
		}else{
			console.error(err);
		}
	});

	//listen for auth state change
	firebase.auth().onAuthStateChanged(myuser => {
		if(myuser != null){
			userName = myuser.displayName;
			userEmail = myuser.email;
			userID = myuser.uid;
			userImage = myuser.photoURL;
			style_signed_in(userImage, userName);
		} else {
			console.log('User Signed Out');
			style_signed_out();
		}
	});	
}

var style_signed_in = (image, name) => {
	$('#ac-p').hide();
	Img.attr('src', image);
	Img1.attr('src', image);
	mail.text(name);
	Img.show();
	Img1.show();
	var greeting = 'Welcome '+ name;
	$('#nav_greet').text(greeting).css({"font-style":"italic", "color":"#d34500"});
}

var style_signed_out = () => {
	userName = null;
	userEmail = null;
	userID = null;
	userImage = null;
	Img.attr('src', null);
	Img1.attr('src', null);
	mail.text('');
	Img.hide();
	Img1.hide();
	$('#nav_greet').text('Settings').css({"font-style":"normal","color":"#000"});
	$('#ac-p').fadeIn('slow');
}
// authentication using email / password 
// const btn_login = document.getElementById('loginbtn');
// const btn_register = document.getElementById('registerbtn');
// const loginEmail = document.getElementById('reg-mail');
// const loginPass = document.getElementById('reg-pass');
// const loginCPass = document.getElementById('cpass');

// btn_register.addEventListener('click', ()=>{
// 	if((loginPass.value && loginEmail.value && loginCPass.value) && (loginPass.value === loginCPass.value)){
// 		createUser();
// 	}	
// });
// btn_login.addEventListener('click', ()=>{loginUser();});

// var createUser = () =>{
// 	firebase.auth().onAuthStateChanged(user=>{
// 		if(user){
// 			firebase.auth().signOut();
// 		}else {
// 			var email = loginEmail.value;
// 			var pass = loginPass.value;
// 			console.log(email);
// 			console.log(pass);
// 			firebase.auth().createUserWithEmailAndPassword(email, pass).then(status=>{
// 				console.log(status);
// 			}).catch(err=>{
// 				console.log("error in creating account"+ err.message);
// 			});
// 		}
// 	});	
// }




