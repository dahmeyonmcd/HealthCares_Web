	/*  Wizard */
	jQuery(function ($) {
		"use strict";
		$('form#wrapped').attr('action', 'survey.php');
		$("#wizard_container").wizard({
			stepsWrapper: "#wrapped",
			submit: ".submit",
			beforeSelect: function (event, state) {
				if ($('input#website').val().length != 0) {
					return false;
				}
				if (!state.isMovingForward)
					return true;
				var inputs = $(this).wizard('state').step.find(':input');
				return !inputs.length || !!inputs.valid();
			}
		}).validate({
			errorPlacement: function (error, element) {
				if (element.is(':radio') || element.is(':checkbox')) {
					error.insertBefore(element.next());
				} else {
					error.insertAfter(element);
				}
			}
		});
		//  progress bar
		$("#progressbar").progressbar();
		$("#wizard_container").wizard({
			afterSelect: function (event, state) {
				$("#progressbar").progressbar("value", state.percentComplete);
				$("#location").text("(" + state.stepsComplete + "/" + state.stepsPossible + ")");
			}
		});
		// Validate select
		$('#wrapped').validate({
			ignore: [],
			rules: {
				select: {
					required: true
				}
			},
			errorPlacement: function (error, element) {
				if (element.is('select:hidden')) {
					error.insertAfter(element.next('.nice-select'));
				} else {
					error.insertAfter(element);
				}
			}
		});
	});

	var config = {
    	apiKey: "AIzaSyCMMxr3GwNMDksb_BjIQR6pe0Z5bNRZ78g",
    	authDomain: "ersemployeeapp.firebaseapp.com",
    	databaseURL: "https://ersemployeeapp.firebaseio.com",
    	projectId: "ersemployeeapp",
    	storageBucket: "ersemployeeapp.appspot.com",
    	messagingSenderId: "495897751515",
    	appId: "1:495897751515:web:8306e0d539f83deae941fe",
    	measurementId: "G-K6YYGE21S6"
  	};

  	// Initialize Firebase
  	firebase.initializeApp(config);
  	firebase.analytics();

	const firestore = firebase.firestore();
	const auth = firebase.auth();

	var userId = new Object;
	var guestuserId = new Object;

	var q0 = [];

	var q1 = ["N","N",];

	var q2 = ["N","N","N","N","N","N","N",];

	var q3 = ["N","N","N",];

	var q4;

	var userDict = new Map([
		["id", ""],
		["email", ""],
		["firstname", ""],
		["lastname", ""],
		["mobile", ""],
	]);

	function setVals(controlType, index, value) {
		if (controlType == "question_1") {
			if (q1[index] == "N") {
				q1[index] = "Y";
			} else {
				q1[index] = "N";
			};
		} else if (controlType == "question_2") {
			if (q2[index] == "N") {
				q2[index] = "Y";
			} else {
				q2[index] = "N";
			};
		} else if (controlType == "question_3") {
			if (q3[index] == "N") {
				q3[index] = "Y";
			} else {
				q3[index] = "N";
			};
		} else if (controlType == "question_4") {
			storeAllResponsesLocally(q1, q2, q3, q0, q4);
		} else if (controlType == "email") {
			userDict.set("email", value)
		} else if (controlType == "firstname") {
			userDict.set("firstname", value)
		} else if (controlType == "lastname") {
			userDict.set("lastname", value)
		} else if (controlType == "mobile") {
			userDict.set("mobile", value)
		};

	};

	function storeAllResponsesLocally(array1, array2, array3, array4, temperature) {
		var dataToPost = {
			prompt1: array4,
			question1: array1,
			question2: array2,
			question4: array3,
			question5: array4,
			temperature: String(temperature),
		};
		storeResponsesGlobally(dataToPost);
	};


	function storeResponsesGlobally(dataToPost) {
			var d = new Date();
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			d.setMilliseconds(0);

			var dateStr = Math.round(d.getTime()/1000);

			if (userId != null) {
				console.log(userId + "This is user id ");
				// Initialize the collection with who last submitted

				firestore.collection("submissions").doc(String(dateStr)).set({
					lastSubmitted: String(userId)
				}).then(() => {}).catch((error) => {
					console.log("Failed to initialize collection")
				});

				// Store the responses in the proper locations
				firestore.collection("submissions").doc(String(dateStr)).collection("submissions").doc(String(userId)).set(dataToPost).then(() => {}).catch((error) => {
					console.log("Error updating document: ", error);
				});

			} else {
				// It's a guest filling it out
				if (guestuserId != null) {

					var userDataToPost = {
						company: "",
						name: String(String(userDict.get("firstname")) + " " + String(userDict.get("lastname"))),
						email: String(userDict.get("email")),
						mobile: String(userDict.get("mobile")),
						id: String(userDict.get("id")),
					}; 

					// Store in guest dictionary
					firestore.collection("guests").doc(String(userDict.get("id"))).set(userDataToPost).then(() => {}).catch((error) => {
						console.log("Failed to store guest user in firebase " + error);
					});
					// Initialize the collection with who last submitted
				
					firestore.collection("submissions").doc(String(dateStr)).set({
						lastSubmitted: String(guestuserId)
					}).then(() => {}).catch((error) => {
						console.log("Failed to initialize collection")
					});

					// Store the responses in the proper locations
					firestore.collection("submissions").doc(String(dateStr)).collection("submissions").doc(String(userDict.get("id"))).set(dataToPost).then(() => {}).catch((error) => {
						console.log("Error updating document: ", error);
					});
				};
			};
	};

	function uuidv4() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	  };

	auth.onAuthStateChanged(firebaseUser => {
  		if(firebaseUser) {
			guestuserId = null;
  			userId = String(firebaseUser.uid);;
  		} else {
			  // Create a user id here and store infomation as guest submissions
			userId = null;
			guestuserId = uuidv4();
			userDict.set("id", guestuserId);
  		};
  	});


// Summary 
function getVals(formControl, controlType, index) {
	switch (controlType) {

		case 'question_1':
			// Get the value for a radio
			var checkboxName = $(formControl).attr('name');

			// Get all checked checkboxes
			var value = [];
			$("input[name*='" + checkboxName + "']").each(function () {
				// Get all checked checboxes in an array
				if (jQuery(this).is(":checked")) {
					value.push($(this).val());
				}
			});
			$("#question_1").text(value.join(", "));
			setVals(controlType, index, "");
			break;

		case 'question_2':
			// Get name for set of checkboxes
			var checkboxName = $(formControl).attr('name');

			// Get all checked checkboxes
			var value = [];
			$("input[name*='" + checkboxName + "']").each(function () {
				// Get all checked checboxes in an array
				if (jQuery(this).is(":checked")) {
					value.push($(this).val());
				}
			});
			$("#question_2").text(value.join(", "));
			setVals(controlType, index, "");
			break;

		case 'question_3':
			// Get the value for a radio
			var checkboxName = $(formControl).attr('name');

			// Get all checked checkboxes
			var value = [];
			$("input[name*='" + checkboxName + "']").each(function () {
				// Get all checked checboxes in an array
				if (jQuery(this).is(":checked")) {
					value.push($(this).val());
				}
			});
			$("#question_3").text(value.join(", "));
			setVals(controlType, index, "");
			break;

		case 'question_4':
			// Get the value for a textarea
			var value = $(formControl).val();
			q4 = value;
			$("#question_4").text(value);
			setVals(controlType, index, "");
			break;

		case 'firstname':
			// Get the value for this text ares
			var value = $(formControl).val ();
			setVals(controlType, index, value);
			break;

		case 'lastname':
			// Get the value for this text ares
			var value = $(formControl).val ();
			setVals(controlType, index, value);
			break;

		case 'email':
			// Get the value for this text ares
			var value = $(formControl).val ();
			setVals(controlType, index, value);
			break;

		case 'mobile':
			// Get the value for this text ares
			var value = $(formControl).val ();
			setVals(controlType, index, value);
			break;
	};

	
}