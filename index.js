var msgs = document.querySelector("#msgs");
var currentDiv = document.querySelector("#current");
var forecast = document.querySelector("#forecast");
var controls = document.querySelector("#controls");
var zipVal,dif,lat,cel,lon,cVal = "a87a4b1d4";
var togNum, togScale, tempNum, tempScale;
var currentWeather ={};


function displayElement(eID){
  document.getElementById(eID).style.display = "inline-block";
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
	msgs.innerHTML = "sniffing your location..."

	if (!navigator.geolocation){// if geolocate unavailable, show zip-code input
		msgs.innerHTML = "<h4>your browser doesn't support geolocation.<br>enter a 5-digit u.s. zip code</h4>";
		displayElement("zipCtrl");
	}

	else {//geolocation available, so call open weather's api
		function success(position){
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			msgs.innerHTML = "<h4>looking up your weather...</h4>";
			apiCall("geo","lat="+lat+"&lon="+lon);
		}
		function error(error){
			msgs.innerHTML = "<h4>geolocation unavailable.<br/>enter a 5-digit<br/>u.s. zip code below.</h4>";
			displayElement("zipCtrl");
		}

		removeElement("locate");
		navigator.geolocation.getCurrentPosition(success,error);
	}
}

cell = "c3c4c47da"+cVal.split('').reverse().join('');

function submitZip() {
	var toTest = document.getElementById("zipInput").value;
	var	response = (/^\d{5}?$/.test(toTest));//tests for 5-digit numerical zip

	if (response===false){
		alert("Aawwww Craaacckk...\n\nEnter a 5-Digit ZIP Code!\n\nThis ain't the Kansas Weather Service, Dorothy.");
		console.log(zipInput.value);
	}
	else {
		zipVal = zipInput.value; //ZIP to SEND to weather API
		removeElement("zipCtrl");
		document.querySelector("#msgs").textContent = "brb - asking your mom for the weather...";
		apiCall("zip",zipVal);
	}
		document.getElementById("zipInput").value = "";
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


function printWeather(wO){//   *  *  *   build the doc elements and display them   *  *  *

	removeElement("msgs");

	var tmpK = wO.main.temp;
	var tmpF = Math.round((tmpK*9/5)-459.67);
	var tmpC = Math.round(tmpK-273.15);
	tempNum = tmpF, tempScale = "F";
   var city = wO.name,
      mainCond = wO.weather[0].main,
      descr = wO.weather[0].description,
      id = wO.weather[0].id, /*weather condition id - use TBD*/
      iconCode = wO.weather[0].icon,
      iconURL = "https:\/\/openweathermap.org\/img\/w\/"+iconCode+".png";

	currentDiv.innerHTML = wO.name+ " Weather</h4><h2><img src='"+ iconURL +"'/></h2><h1><span id='togNum'>" + tempNum + "</span>\xB0<span id='togScale'>" + tempScale + "</span></h1><p>" + wO.weather[0].description + "<br/>humidity: " + wO.main.humidity + "%";
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

	displayElement("restart");

}

function restart(){
	removeElement("restart");
	displayElement("zipCtrl");
}
