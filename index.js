var msgs = document.querySelector("#msgs");
var currentDiv = document.querySelector("#current");
var forecast = document.querySelector("#forecast");
var controls = document.querySelector("#controls");
var zipVal,dif,lat,cel,lon,cVal = "a87a4b1d4";


function displayElement(eID){
   document.getElementById(eID).style.display = "block";
}

function removeElement(eID){
	document.getElementById(eID).style.display = "none";
}

function unhideElement(eID){
	document.getElementById(eID).style.visibility = "visible";
}

function geoLoc(){
	if (!navigator.geolocation){// if geolocate unavailable
		unhideElement("msgs");
		msgs.innerHTML = "<h4>Your browser does not support geolocation.</h4>";
		displayElement("zipCtrl");
	}

	else {
		function success(position){
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			document.querySelector("#msgs").textContent = "Hang on while we look up your weather...";
			document.querySelector("#testDiv").textContent = "coordinates: lat: "+lat+" lon: "+lon;
			apiCallMerge("geo","lat="+lat+"&lon="+lon);
			}
		function error(error){
			unhideElement("msgs");
			document.querySelector("#msgs").textContent = "Location Access Unavailable. Enter Zip below.";
			displayElement("zipCtrl");
		}
		navigator.geolocation.getCurrentPosition(success,error);
	}
}
geoLoc();

cell = "c3c4c47da"+cVal.split('').reverse().join('');

function submitZip() {
	var toTest = document.getElementById("zipInput").value;
	//var	response = (/^\d{5}(-\d{4})?$/.test(toTest));// test for valid (5 or 5+4 digit US) zip codes
	var	response = (/^\d{5}?$/.test(toTest));//test for just 5-dig zip

	if (response===false){
		alert("Aawwww Craaacckk...\n\nEnter a 5-Digit ZIP Code!\n\nThis ain't the Kansas Weather Channel, Dorothy.");
		console.log(zipInput.value);
	}
	else {
		zipVal = zipInput.value; //ZIP to SEND to weather API
		removeElement("zipCtrl");
		document.querySelector("#msgs").textContent = "Hang on while we look up your weather...";
		apiCallMerge("zip",zipVal);
	}
		document.getElementById("zipInput").value = "";
}
dif = "d=524d852309ce12"+cell;
var currentWeather ={};

function apiCallMerge(mod,val){//api call by lat,lon coords
   var modifier = (mod=="zip")?(mod + "=" + val + ",us"):val;
	var owURL = "https://api.openweathermap.org/data/2.5/weather?" + modifier + "&appi"+dif;
   var request = new XMLHttpRequest();
	request.open('GET',owURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		currentWeather = request.response;
		console.log(currentWeather);
		printWeather(currentWeather);
	}

}

function printWeather(wO){
	removeElement("msgs");

	currentDiv.textContent =
      "Currently in "+ wO.name
      + "\nit's " + wO.weather[0].main
      + "and" + wO.weather[0].description+" Temp: "+ wO.main.temp+ "\xB0"
      +"\nHumidity: "+wO.main.humidity+"%"
   ;

   //cw.description //"clear sky
	//cw.icon //02d ??
	//cw.id //800??
	//cw.main //"Clear

}
