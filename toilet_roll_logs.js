//Declaration of global variables
var toiletRollNumber=0;
var quiltex_items= [];
var kleenox_items = [];
var inHouseBrand_items = [];
var abSorbent_items = [];
var softLife_items = [];
var treatments=["Quiltex", "Kleenox", "InHouseBrand", "AbSorbent", "SoftLife"];
var conds = ["", "Single-Ply", "2-Ply", "3-Ply"];
var opt = {timeout: 10000, enableHighAccuracy: true};
var latitude = 0.0;
var longitude = 0.0;
var watchGeo=null;
document.ontouchmove = function(e){ e.preventDefault(); }




//Define the page header for each brand
function getID(theValue){
   switch (theValue.id ) {
	 
   case "0":
   		toiletRollNumber=0
   		break
   case "1":
   		toiletRollNumber=1
   		break
   case "2":
   		toiletRollNumber=2
   		break
   case "3":
   		toiletRollNumber=3
   		break
   case "4":
   		toiletRollNumber=4
   		break

		   	}
   $.mobile.changePage("index.html#treatment")
};

$(document).delegate("#treatment", "pagecreate", function() {
	var item = $('#toiletRoll');
	item.text(treatments[toiletRollNumber]);
			
	$('#saveLog').tap(function(){
		var id = treatments[toiletRollNumber];
		var today = new Date();
		var date= today.getDate()+"/"+(today.getMonth()+1).toString()+"/"+today.getFullYear();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateString= date+" "+time;
		var toiletRoll_id= document.forms["myForm"]["toiletRoll_id"].value;
		var num_rolls_stacked = document.forms["myForm"]["num_rolls_stacked"].value;
		var width= document.forms["myForm"]["width"].value;
		var length= document.forms["myForm"]["length"].value;
		var softness= document.forms["myForm"]["softness"].value;
		var validation=true;
			
		if (toiletRoll_id <= 1000 || toiletRoll_id >= 9999) {
			alert("Product code must be 4 characters")
			validation=false;
			$('#toiletRoll_id').val("")
	    }
		if (num_rolls_stacked < 0 || num_rolls_stacked> 1000 || num_rolls_stacked == "") {
		alert("Number of rolls stacked must be between 0 and 1000")
		validation=false;
		$('#num_rolls_stacked').val("")
	    }
		if (width < 0 || width> 15 || width == "") {
			alert("width is from 0 cm to 15 cm")
			validation=false;
			$('#width').val("")
		}
        if (length< 0 || length > 15 || length == '') {
			alert("length is from 0 cm to 15 cm")
		    validation=false;
			$('#length').val("")
		}
		if (softness == ""){
			alert("you need to choose the softness of the toiletroll between Single-Ply, 2-Ply or 3-Ply ")
			validation=false;
			$('#softness').val("").selectmenu("refresh")
		}
			
		if(validation==true){
			var itemdata={ 
			id:id, 
			date:dateString, 
			latitude:latitude, 
			longitude: longitude, 
			toiletRoll_id:$('#toiletRoll_id').val(),
			num_rolls:$('#num_rolls_stacked').val(),
			width:$('#width').val(), 
			length:$('#length').val(),
			softness_type:conds[$('#softness').val()]
			};

	//the object is converted to string		
			switch (toiletRollNumber) {
			    case 0:
			        quiltex_items.push(itemdata);
			        console.log(quiltex_items);
    	            localStorage.quiltex_items = JSON.stringify(quiltex_items);
       	        break;
                case 1:
	                kleenox_items.push(itemdata);
 	                localStorage.kleenox_items = JSON.stringify(kleenox_items);
       	        break;
                case 2:
				    inHouseBrand_items.push(itemdata);
	                localStorage.inHouseBrand_items= JSON.stringify(inHouseBrand_items);
             	break;
                case 3:
	                abSorbent_items.push(itemdata);
	                localStorage.abSorbent_items = JSON.stringify(abSorbent_items);
       	        break;
                case 4:
	                softLife_items.push(itemdata);
	                localStorage.softLife_items = JSON.stringify(softLife_items);
             	break;         
   	        }
   	    alert("Log saved");
   	    removeAll();
   	    }
        else {
			alert("Log not saved. Please fix problems and try again.")
		}
    });
});


$(document).on("pageshow", "#treatment", function() {
	var item = $('#toiletRoll');
	item.text(treatments[toiletRollNumber]);
	removeAll();
	watchGeo=navigator.geolocation.getCurrentPosition(onSuccess, onError, opt);
});
  
$(window).unload(function(){
	navigator.geolocation.clearWatch(watchGeo);
})

//Functions for the location 
var onSuccess = function(position) {
	latitude = position.coords.latitude
    longitude = position.coords.longitude
	console.log(latitude + "   " + longitude);
};

var onError = function(error) {
	var txt;
	switch(error.code) {
		case error.PERMISSION_DENIED:    txt = 'Location permission denied'; break;
		case error.POSITION_UNAVAILABLE: txt = 'Location position unavailable'; break;
		case error.TIMEOUT:              txt = 'Location position lookup timed out'; break;
		default: txt = 'Unknown position.'
    }
alert(txt)
}

//Previous page
function previouspage(){
	if (toiletRollNumber == 0) {
		toiletRollNumber=4
	}
	else {
		toiletRollNumber = toiletRollNumber-1
	}
	var item = $('#toiletRoll');
	item.text(treatments[toiletRollNumber]);
	removeAll(); 
}

//next page
function nextpage(){
	if (toiletRollNumber == 4) {
		toiletRollNumber=0
    }
	else {
		toiletRollNumber= toiletRollNumber+1
   	}
	var item = $('#toiletRoll');
	item.text(treatments[toiletRollNumber]);
	removeAll(); 
}

//Clear all the inputs
function removeAll() {
	$('#toiletRoll_id').val("")
	$('#num_rolls_stacked').val("")
	$('#width').val("")
	$('#length').val("")
	$('#softness').val("").selectmenu("refresh")
}

//function to show the data en showlog page
function show_logs() {
		
    $('#toilet_log').empty();

    switch (toiletRollNumber) {
     case 0:
     	console.log(quiltex_items);
  		for( var i = 0; i < quiltex_items.length; i++ ) {
    		additem(quiltex_items[i],true);
  		};
   		break
     case 1:
      	for( var i = 0; i < kleenox_items.length; i++ ) {
    		additem(kleenox_items[i],true);
  		};
   		break
     case 2:

  		for( var i = 0; i < inHouseBrand_items.length; i++ ) {
    		additem(inHouseBrand_items[i],true);
  		};
   		break
     case 3:

  		for( var i = 0; i < abSorbent_items.length; i++ ) {
    		additem(abSorbent_items[i],true);
  		};
   		break
     case 4:
  		for( var i = 0; i < softLife_items.length; i++ ) {
    		additem(softLife_items[i],true);
  		};
   		break
   	}

   	$.mobile.changePage("index.html#showLogs")
	var item = $('#title');
    item.text(treatments[toiletRollNumber]);
}


// JSON parse converts String to object
$(document).ready(function(){
	quiltex_items=JSON.parse(localStorage.quiltex_items || '[]');
    kleenox_items=JSON.parse(localStorage.kleenox_items || '[]');
    inHouseBrand_items=JSON.parse(localStorage.inHouseBrand_items || '[]');
    abSorbent_items=JSON.parse(localStorage.abSorbent_items || '[]');
    softLife_items=JSON.parse(localStorage.softLife_items || '[]');
});


function additem(itemdata, nosave, target = null) {
	var item = $('#item_').clone();
	
	item.attr({id:itemdata.id});
    item.find('span.the_time').text(itemdata.date.toString());
    item.find('span.latitude_log').text(", "+itemdata.latitude);
    item.find('span.longitude_log').text(", "+itemdata.longitude);
    item.find('span.toiletroll_log').text(", "+itemdata.toiletRoll_id);
    item.find('span.numberRolls_log').text(", "+itemdata.num_rolls);
    item.find('span.width_log').text(", "+itemdata.width);
    item.find('span.length_log').text(", "+itemdata.length);   
    item.find('span.softness_log').text(", "+itemdata.softness_type);
    

    if(target == null){
    	if (!nosave){
		$("#toilet_log").append(item).listview('refresh');
	    }
		else {
			$("#toilet_log").append(item);
		}
    }
    else{
    	if (!nosave){
    		$("#"+target).append(item).listview('refresh');
	    }
		else {
			$("#"+target).append(item);
		}
    	
    }
}

// Function for the button yes in sendlog
function yes(){
	var empty=$('#toilet_log').empty();
	var data;

	switch (toiletRollNumber) {
		case 0:
			data = JSON.parse(localStorage.quiltex_items || '[]');
		    while( quiltex_items.length) { 
			    quiltex_items.shift();
			}
            localStorage.removeItem("quiltex_items")   
        break
        case 1:
            data = JSON.parse(localStorage.kleenox_items || '[]');
            while( kleenox_items.length) {
	            kleenox_items.shift();
			}	
            localStorage.removeItem("kleenox_items") 
        break
		case 2:
			data = JSON.parse(localStorage.inHouseBrand_items || '[]');
		    while( inHouseBrand_items.length) { 
                inHouseBrand_items.shift();
		    }
            localStorage.removeItem("inHouseBrand_items") 
        break
        case 3:
        	data = JSON.parse(localStorage.abSorbent_items || '[]');
            while( abSorbent_items.length) { 
                abSorbent_items.shift();
            }
            localStorage.removeItem("abSorbent_items")  
        break
	    case 4:
	    	data = JSON.parse(localStorage.softLife_items || '[]');
            while( softLife_items.length) { 
                softLife_items.shift();
            }
            localStorage.removeItem(softLife_items)  
        break

    }
    console.log(data);
	$.ajax({
              type: 'POST',
              data: {'logs':JSON.stringify(data)},
              url: 'http://127.0.0.1:3000/toiletroll/log',
              dataType:'json',
              success: function(response) {
                // Success message
                alert(response.msg);
              },
              error: function(data) {
              	// Failure message
                alert("Data could not be sent to server.");
              }
          });
    $.mobile.changePage("index.html#treatment")
	alert('Logs sent');

}

// Back page
function getLogs(){
	var toiletRollType = treatments[toiletRollNumber];
	$.ajax({
              type: 'GET',
              url: 'http://127.0.0.1:3000/toiletroll/search/?type='+toiletRollType,
              dataType:'json',
              success: function(response) {
              	//console.log(response.toiletRollLogs);
              	var respLogsArr = response.toiletRollLogs;
              	$('#response-log-items').html("");
			    respLogsArr.forEach(function (logs) {
			        console.log(logs);
			        additem(logs,true,"response-log-items");
			    });
              },
              error: function(data) {
              	// Failure message
                alert("Data could not be fetched from server.");
              }
          });
    $.mobile.changePage("#get-log-page");
}



														