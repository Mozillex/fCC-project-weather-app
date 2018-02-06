var msgs = document.querySelector("#msgs");
var today = document.querySelector("#today");
var forecast = document.querySelector("#forecast");
var controls = document.querySelector("#controls");
var zipVal,dif,lat,cel,lon,cVal = "a87a4b1d4";
var togNum, togScale, tempNum, tempScale;
var currentWeather ={};

function displayElement(eID){
   document.getElementById(eID).style.display = "block";
}

function removeElement(eID){
	document.getElementById(eID).style.display = "none";
}

function unhideElement(eID){
	document.getElementById(eID).style.visibility = "visible";
}

// - - - GEOLOCATION for Weather
function geoLoc(){

   unhideElement("msgs");

	if (!navigator.geolocation){// if geolocate unavailable, show zip-code input
		msgs.innerHTML = "<h4>Your browser does not support geolocation.<br>Enter a 5-Digit US ZipCode Below</h4>";
		displayElement("zipCtrl");
	}

	else {//geolocation available, so call open weather's api
		function success(position){
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			msgs.innerHTML = "<h4>Hang on while we look up your weather...</h4>";
			apiCall("geo","lat="+lat+"&lon="+lon);
		}
		function error(error){
			unhideElement("msgs");
			msgs.innerHTML = "<h4>Geolocation is Unavailable.<br/>Enter a 5-digit U.S. ZipCode below.</h4>";
			displayElement("zipCtrl");
		}

		navigator.geolocation.getCurrentPosition(success,error);
	}
}
geoLoc();

cell = "c3c4c47da"+cVal.split('').reverse().join('');

function submitZip() {
	var toTest = document.getElementById("zipInput").value;
	var	response = (/^\d{5}?$/.test(toTest));//tests for 5-digit numerical zip

	if (response===false){
		alert("Aawwww Craaacckk...\n\nEnter a 5-Digit ZIP Code!\n\nThis ain't the Kansas Weather Channel, Dorothy.");
		console.log(zipInput.value);
	}
	else {
		zipVal = zipInput.value; //ZIP to SEND to weather API
		//removeElement("zipCtrl");
		document.querySelector("#msgs").textContent = "brb: Running outside to get your weather...";
		apiCall("zip",zipVal);
	}
		//document.getElementById("zipInput").value = "";
      zipInput.value = "";
}
dif = "d=524d852309ce12"+cell;


// - - - - -
function apiCall(mod,val){//api call by lat,lon coords

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

	var tmpK = wO.main.temp;
	var tmpF = Math.round((tmpK*9/5)-459.67);
	var tmpC = Math.round(tmpK-273.15);
	tempNum = tmpF, tempScale = "F";

	today.innerHTML = "<h4>Current Weather in "+ wO.name+ "</h4><h2>" + wO.weather[0].main + "</h2><h1><span id='togNum'>" + tempNum + "</span>\xB0<span id='togScale'>" + tempScale + "</span></h1><p>" + wO.weather[0].description + " and " + wO.main.humidity + "% humidity";
   togScale = document.getElementById("togScale");
   togNum = document.getElementById("togNum");

   togScale.addEventListener("click",toggle);

   function toggle(){
		if (tempScale=="F"){
			tempScale="C";
			tempNum = tmpC;
		} else {
			tempScale = "F";
			tempNum = tmpF;
		}
      togScale.textContent = tempScale;
      togNum.textContent = tempNum;
	}

}
