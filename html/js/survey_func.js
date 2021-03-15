	/*  Wizard */
	jQuery(function ($) {
		"use strict";
		$('form#wrapped').attr('action', 'result.html');
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

	const submitButton = document.querySelector("#submitButton");

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
	if (firebase.apps.length === 0) {
		firebase.initializeApp(config);
  		//firebase.analytics();
	};

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

	if (submitButton != null) {
		submitButton.addEventListener("click", function() {
			if (userId != null) {
				// console.log("Navigating with user id: " + userId);
				var queryString = "?userid1=" + userId;
				window.location.href = "result.html" + queryString;
			} else {
				if (guestuserId != null) {
					// console.log("Navigating with guest user id: " + guestuserId);
					var queryString = "?userid1=" + guestuserId;
					window.location.href = "result.html" + queryString;
				};
			};
			
		});
	};

	function setVals(controlType, index, value) {
		if (controlType == "question_1") {
			if (q1[index] == "N") {
				q1[index] = "Y";
			} else {
				if (q1[index] == "Y") {
					q1[index] = "N";
				};
			};
		} else if (controlType == "question_2") {
			if (q2[index] == "N") {
				q2[index] = "Y";
			} else {
				if (q2[index] == "Y") {
					q2[index] = "N";
				};
			};
		} else if (controlType == "question_3") {
			if (q3[index] == "N") {
				q3[index] = "Y";
			} else {
				if (q3[index] == "Y") {
					q3[index] = "N";
				};
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

	var theVariable = window.parent.q1

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

	function setCookie(name,value,exp_days) {
		var d = new Date();
		d.setTime(d.getTime() + (exp_days*24*60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = name + "=" + value + ";" + expires + ";path=/";
	};

	function getCookie(name) {
		var cname = name + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i < ca.length; i++){
			var c = ca[i];
			while(c.charAt(0) == ' '){
				c = c.substring(1);
			}
			if(c.indexOf(cname) == 0){
				return c.substring(cname.length, c.length);
			}
		}
		return "";
	};

	function deleteCookie(name) {
		var d = new Date();
		d.setTime(d.getTime() - (60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = name + "=;" + expires + ";path=/";
	}


	function storeResponsesGlobally(dataToPost) {
			var d = new Date();
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			d.setMilliseconds(0);

			submitButton.style.display = "inline-block";

			var dateStr = Math.round(d.getTime()/1000);

			if (userId != null) {
				// onsole.log(userId + "This is user id ");
				// Initialize the collection with who last submitted

				firestore.collection("submissions").doc(String(dateStr)).set({
					lastSubmitted: String(userId)
				}).then(() => {}).catch((error) => {
					// console.log("Failed to initialize collection")
				});

				// Store the responses in the proper locations
				firestore.collection("submissions").doc(String(dateStr)).collection("submissions").doc(String(userId)).set(dataToPost).then(() => {}).catch((error) => {
					// console.log("Error updating document: ", error);
				});

			} else {
				// It's a guest filling it out
				if (guestuserId == null) {

					// console.log("Guest id is not stored: " + String(mainEmailField.value));

					firestore.collection("guests").where("email", "==", String(mainEmailField.value)).get().then((snapshot) => {
						if (snapshot.empty) {

							// console.log("Could not find user entity in guests");

							// Assign user a UUID because one isn't found
							if (guestuserId != null) {
								nextStoreProcedure(dataToPost, dateStr);
							} else {
								// console.log("Assigning new id to user");
								guestuserId = String(uuidv4());
								userDict.set("id", guestuserId);
								// console.log("id assigned: " + guestuserId);
								nextStoreProcedure(dataToPost, dateStr);
							};
						} else {
							//
							const doc = snapshot.docs[0]

							const id = doc.get("id");
							guestuserId = String(id);
							userDict.set("id", guestuserId);

							// console.log("found: " + String(id));

							var userDataToPost = {
								company: "",
								name: String(String(userDict.get("firstname")) + " " + String(userDict.get("lastname"))),
								email: String(userDict.get("email")),
								mobile: String(userDict.get("mobile")),
								id: String(userDict.get("id")),
							}; 
		
							// Store in guest dictionary
							firestore.collection("guests").doc(String(userDict.get("id"))).set(userDataToPost).then(() => {}).catch((error) => {
								// console.log("Failed to store guest user in firebase " + error);
							});
							// Initialize the collection with who last submitted
						
							firestore.collection("submissions").doc(String(dateStr)).set({
								lastSubmitted: String(guestuserId)
							}).then(() => {}).catch((error) => {
								// console.log("Failed to initialize collection")
							});
		
							// Store the responses in the proper locations
							firestore.collection("submissions").doc(String(dateStr)).collection("submissions").doc(String(userDict.get("id"))).set(dataToPost).then(() => {}).catch((error) => {
								// console.log("Error updating document: ", error);
							});

							//
						};
					}).catch((error) => {

					});
				} else {
					// console.log("Guest now set, proceed to next step");
					nextStoreProcedure(dataToPost, dateStr);
				};
			};
	};

	function nextStoreProcedure(dataToPost, dateStr) {
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
				// console.log("Failed to store guest user in firebase " + error);
			});
			// Initialize the collection with who last submitted
		
			firestore.collection("submissions").doc(String(dateStr)).set({
				lastSubmitted: String(guestuserId)
			}).then(() => {}).catch((error) => {
				// console.log("Failed to initialize collection")
			});
		
			// Store the responses in the proper locations
			firestore.collection("submissions").doc(String(dateStr)).collection("submissions").doc(String(userDict.get("id"))).set(dataToPost).then(() => {}).catch((error) => {
				// console.log("Error updating document: ", error);
			});
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
			userDict.set("id", userId);
  		} else {
			  // Create a user id here and store infomation as guest submissions
			userId = null;
			guestuserId = null;
  		};
  	});

	// NEXT PAGE
	


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