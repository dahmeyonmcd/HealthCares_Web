//(function() {

	//Initialize Firebase
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

 	const firestore2 = firebase.firestore();
  	const auth2 = firebase.auth();

  	var already = false;
  	var creating = false;
  	var created = false

  	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  	var selectedcompany = new Object;

  	//const docRef = firestore.collection("access_codes")

  	const loginWizard = document.getElementById("start_logged");
  	const normalWizard = document.getElementById("start");
  	// HOMEPAGE REFERENCES

  	const userHeader = document.getElementById("userLabel");
  	const alreadyHaveAccountButton = document.querySelector("#alreadyHaveAccountButton");
  	const mainSignOutButton = document.querySelector("#signout_MainButton");
  	const mainRegisterButton = document.querySelector("#registerButton");
  	const mainGuestButton = document.querySelector("#guestButton");
  	const nextButton = document.querySelector("#next_button");
	const userSubHeader = document.getElementById("mainSubHeader");

	  // Main Fields
	  const mainEmailField = document.getElementById("mainemailField");
	  const firstNameField = document.getElementById("firstnameField");
	  const lastNameField = document.getElementById("lastnameField");
	  const mobileNameField = document.getElementById("mainmobileField");

  	// LOGIN PAGE REFERENCES
  	const emailTextField = document.querySelector("#create_emailField");
  	//const createEmailTextField = document.querySelector("#create_emailField");
  	const passwordTextField = document.querySelector("#passwordField");
  	const signinButton = document.querySelector("#signin_button");
  	const signoutButton = document.querySelector("#signout_button");
  	const mobileTextField = document.querySelector("#mobileField");
  	const confirmPasswordTextField = document.querySelector("#confirmPasswordField");
  	const nameTextField = document.querySelector("#nameField");
  	const accessCodeTextField = document.querySelector("#accessCodeField");

	document.querySelector("#submitButton").style.display = "none";

  	already = false;

  	loginWizard.style.display = "none";
  	normalWizard.style.display = "flex";

  	signinButton.style.display = "none";
  	nextButton.style.display = "inline-block";
  	mainGuestButton.style.display = "none";
  	mainSignOutButton.style.display = "none";
  	userHeader.style.display = "none";
  		
  	//alreadyHaveAccountButton.addEventListener("click", );
  	signinButton.addEventListener("click", signInTapped);
  	signoutButton.addEventListener("click", signOutTapped);
  	alreadyHaveAccountButton.addEventListener("click", alreadyHaveAnAccountTapped);
  	mainRegisterButton.addEventListener("click", registerTapped);
  	mainGuestButton.addEventListener("click", guestTapped);
  	mainSignOutButton.addEventListener("click", signOutTapped);

  	startLoading();

  	function startLoading() {
		$("#loader_form").fadeIn();
	};

	function stopLoading() {
		$('[data-loader="circle-side"]').fadeOut(); // will first fade out the loading animation
		$("#loader_form").delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
		$('body').delay(350).css({
			'overflow': 'visible'
		});
	};

	auth2.onAuthStateChanged(firebaseUser => {
  		if(firebaseUser) {
  			if (created == true) {
  				storeUserInfo(String(firebaseUser.uid));
  			} ;

  			signoutButton.style.display = "block";
  			mainSignOutButton.style.display = "inline-block";
  			mainRegisterButton.style.display = "none";
  			signinButton.style.display = "none";
  			alreadyHaveAccountButton.style.display = "none";
  			mainGuestButton.style.display = "none";

  			normalWizard.style.display = "flex";
  			loginWizard.style.display = "none";

  			firestore2.collection("members").doc(firebaseUser.uid).get().then((doc) => {
  				console.log(doc);
  				if(doc.exists) {
  					const name = doc.get("name");
					const emailStr = doc.get("email");
					const mobileStr = doc.get("mobile");

  					userHeader.style.display = "block";
  					userHeader.innerHTML = String(("Welcome back, ") + "<b>" + name + "</b>");
					  mainEmailField.value = String(emailStr);
					  firstNameField.value = String(name).split(" ")[0];
					  lastNameField.value = String(name).split(" ")[1];
					  mobileNameField.value = String(mobileStr);

					  mainEmailField.disabled = true;
					  userSubHeader.innerHTML = String("Please verify your user information");
					  nextButton.style.display = "inline-block";
					  
  					stopLoading();
  				};
  			});
  		} else {
  			console.log("not logged in");
  			userId = null;
  			signoutButton.style.display = "none";
  			mainSignOutButton.style.display = "none";
  			mainRegisterButton.style.display = "inline-block";
  			alreadyHaveAccountButton.style.display = "inline-block";
  			userHeader.style.display = "none";
			mainEmailField.value = "";
			firstNameField.value = "";
			lastNameField.value = "";
			mobileNameField.value = "";
			mainEmailField.disabled = false;

			userSubHeader.innerHTML = String("Please fill with your details");

  			if (already == true) {
  				alreadyHaveAccountButton.style.display = "none";

  				normalWizard.style.display = "none";
  				loginWizard.style.display = "flex";

  				guestButton.style.display = "inline-block";
  			} else {
  				alreadyHaveAccountButton.style.display = "inline-block";
  				
  				normalWizard.style.display = "flex";
  				loginWizard.style.display = "none";
  			};

  			stopLoading();
  		};
  	});

  	function storeUserInfo(userId) {
  		const nameStr = String(nameTextField.value);
  		const mobile = String(nameTextField.value);
  		const confirmPassword = String(nameTextField.value);
  		const accessCodeStr = String(nameTextField.value);
  		const emailStr = String(emailTextField.value);

  		if (String(selectedcompany) != "") {

  			var docData = {
    			id: String(userId),
    			company: String(selectedcompany),
    			access_code: accessCodeStr,
    			email: emailStr,
    			name: nameStr,
    			password: String(btoa(confirmPassword))
			};

  			firestore2.collection("members").doc(String(userId)).set(docData).then(() => {
  				// console.log("Document successfully updated");
  				stopLoading();
  			}).catch((error) => {
				stopLoading();
  			});
  		} else {

  		};
  	};

  	function signInTapped() {
  		const email = emailTextField.value;
  		const password = passwordTextField.value;

  		if (already == true) {
  			// User already has an account
  			startLoading();
  			const promise = auth2.signInWithEmailAndPassword(email, password);
  			created = false
  			promise.catch(e => {
  				stopLoading();
  			});
  		} else {
  			// User wants to sign up
  			auth.signOut();
  			checkForAccessCode(email, password);
  		};
  	};

  	function checkForAccessCode(email, password) {

  		const name = nameTextField.value;
  		const mobile = mobileTextField.value;
  		const confirmPassword = confirmPasswordTextField.value;
  		const accessCode = accessCodeTextField.value;

  		if (name != null || mobile != null || confirmPassword != null || accessCode != null) {
  			if (name != "") {
  				if (mobile != "") {
  					if (confirmPassword != "") {
  						if (accessCode != "") {
  							// Continue
  							if (password == confirmPassword) {

  								startLoading();

  								checkForAccessCode2(email, accessCode);

  							} else {
								showAlert("failed", "Please fill out all fields");
  							};
  						} else {
							showAlert("failed", "Please fill out all fields");
  						};
  					} else {
						showAlert("failed", "Please fill out all fields");
  					};
  				} else {
  					showAlert("failed", "Please fill out all fields");
  				};
  			} else {
				showAlert("failed", "Please fill out all fields");
  			}
  		} else {
			showAlert("failed", "Please fill out all fields");
  		};
  	};

  	function showAlert(title, message) {
  		alert(message);
  	};

  	function checkForAccessCode2(iemail, access_code) {
  		// console.log(String(access_code));
  		const password = passwordTextField.value;

  		firestore2.collection("access_codes").doc(String(access_code)).get().then((doc) => {
  			if (doc.exists) {
  				const data = doc.data();
  				const userEmail = doc.get("email")
  				const cmpy = doc.get("company")

  				if (String(userEmail) == String(iemail)) {
  					selectedcompany = String(cmpy)
  					// console.log("Creating account...");
  					const promise = auth2.createUserWithEmailAndPassword(String(iemail), String(password));
  					created = true;
  					promise.catch(e => {
  						stopLoading();
  						created = false;
  					});
  				} else {
					// console.log("Not the proper email address");
					stopLoading();
					showAlert("Failed", "You've entered the incorrect email address");
  				};
  			}  else {
  				// console.log("Failed to find account");
  				stopLoading();
				showAlert("Failed", "Access code does not exist");
  			};
  		}).catch((error) => {
  			// console.log("Error getting documents: ", error);
  			stopLoading();
			  showAlert("Failed", "Access code does not exist");
  		});
  	};

	  // Restricts input for the given textbox to the given inputFilter function.
	function setInputFilter(textbox, inputFilter) {
		["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
	  		textbox.addEventListener(event, function() {
				if (inputFilter(this.value)) {
		  			this.oldValue = this.value;
		  			this.oldSelectionStart = this.selectionStart;
		  			this.oldSelectionEnd = this.selectionEnd;
				} else if (this.hasOwnProperty("oldValue")) {
		  			this.value = this.oldValue;
		  			this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
				} else {
		  			this.value = "";
				}
	  		});
		});
  	};
	
	setInputFilter(document.getElementById("temperatureTextArea"), function(value){
		return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
	});
  	
  	function signOutTapped() {
  		startLoading();
  		auth.signOut();
  	};

  	function toggleSignUpFields() {
  		creating = true;
  		if (creating == true) {
  			showSignUpFields;
  		} else {
  			hideSignUpFields;
  		}
  	}

  	function hideSignUpFields() {
  		nameTextField.style.display = "none"
  		mobileTextField.style.display = "none"
  		confirmPasswordTextField.style.display = "none"
  		accessCodeTextField.style.display = "none"
  	}

  	function showSignUpFields() {
  		nameTextField.style.display = "inline-block"
  		mobileTextField.style.display = "inline-block"
  		confirmPasswordTextField.style.display = "inline-block"
  		accessCodeTextField.style.display = "inline-block"
  	}

  	function alreadyHaveAnAccountTapped() {
  		console.log("Already have an account tapped");
  		already = true;
  		hideSignUpFields();
  		loginWizard.style.display = "flex";
  		normalWizard.style.display = "none";
  		signinButton.style.display = "block";
  		nextButton.style.display = "none";
  		mainGuestButton.style.display = "inline-block"
  		alreadyHaveAccountButton.style.display = "none"
  		mainRegisterButton.style.display = "inline-block"
  	};

  	function guestTapped() {
  		already = false;
  		hideSignUpFields();
  		loginWizard.style.display = "none";
  		normalWizard.style.display = "flex";
  		signinButton.style.display = "none";
  		nextButton.style.display = "inline-block";
  		mainGuestButton.style.display = "none";
  		mainRegisterButton.style.display = "inline-block";
  		alreadyHaveAccountButton.style.display = "inline-block"
  	};

  	function registerTapped() {
  		already = false;
  		showSignUpFields();
  		loginWizard.style.display = "flex";
  		normalWizard.style.display = "none";
  		signinButton.style.display = "block";
  		nextButton.style.display = "none";
  		mainGuestButton.style.display = "inline-block";
  		mainRegisterButton.style.display = "none";
  		alreadyHaveAccountButton.style.display = "inline-block";
  	};

//})();