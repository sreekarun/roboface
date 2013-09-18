(function(window, $, Firebase, undefined){
	//namespace
	var ROBOFACE = {};

	

	ROBOFACE.events = (function(){
		var init = function(){
			//Do the event registrattions here
			document.addEventListener("deviceready", function(){
				$(document.body).trigger('roboface.cordovaReady');
			}, false)
			
			var moodRef = new Firebase('https://nextg.firebaseio.com/robo/mood');
			
			moodRef.on('value',function(snapshot){
				var mood = snapshot.val();
				console.log("mood", mood);
				var classVar = 'face ' + mood;
				console.log(classVar);
				$('.face').removeClass().addClass( classVar );
				
			});
			
		};

		init();

		return{

		};

	})();



	/*Model for ROBOFACE 


	*/
	ROBOFACE.Model  = function(){
		var _firebaseRef = new Firebase('https://nextg.firebaseio.com/');
		this.dataRef = _firebaseRef;
		this.restBaseUrl = 'https://nextg.firebaseio.com/robo/';
	};

	ROBOFACE.Model.prototype = {
		getMood: function(){
			var promise = $.getJSON(this.restBaseUrl + "mood" +  ".json");
			return promise;
		},
		setMood: function(){

		},
		setGeoLocation: function(position){
			this.dataRef.child('robo').update({geolocation:position});
		},
		setAcceleroInfo: function(obj){
			//TODO : better checking for obj
			if(!obj){
				return;
			}
		    this.dataRef.child('robo').update({accel:{x:obj.x,y:obj.y,z:obj.z,time:obj.timestamp}});
		},
		setCompassInfo : function(heading){
			this.dataRef.child('robo').update({compass:heading});
		}

	};



	/*View for ROBOFACE 


	*/
	ROBOFACE.View = function($el){


	};



	//Test codes here
	var myModel = new ROBOFACE.Model();
	function updateMood(){
		myModel.getMood().done(function(mood){
			var classVar = 'face ' + mood;
			console.log(classVar);
			$('.face').removeClass().addClass( classVar );
		})
		setTimeout(updateMood, 500);	
	};
	

	

	var options = { frequency: 3000 };  // Update every 3 seconds

	$(document.body).on('roboface.cordovaReady', function(){
		
		// Push the accelerometer data
		navigator.accelerometer.watchAcceleration(
			function(accel){
				myModel.setAcceleroInfo(accel);
			}, function(){
				console.log("error");
			},options
		);
		
		//Push the Geolocation information
		navigator.geolocation.watchPosition(
			function(position){
				myModel.setGeoLocation(position);
			}, function(){
				console.log('error');
			}
		);
		
		// push the compass info back to cloud
		navigator.compass.watchHeading(function(heading){
			myModel.setCompassInfo(heading);
			
		}, function(){
			console.log('error fetching compass info');
		}, {frequency : 3000});
		
	})



})(window, jQuery, Firebase);