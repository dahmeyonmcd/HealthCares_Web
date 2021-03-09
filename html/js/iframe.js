//(function() {


    var myVariable = new Object;

    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const currentUserID = urlParams.get('userid1');

    checkUserResponses(String(currentUserID), false);

    var notpermittedText = "Self quarantine for at least 10 days from the date on which you first experienced any of the previous symptoms. \n\nWait until you have no fever for at least 3 days (without the use of fever-reducing medication) \n\nImproved respitory symptoms (no cough, shortness of breath)";

    document.querySelector("#close_button").addEventListener("click", function() {
		window.location = "index.html";
	});

    function iframe_startLoading() {
		$("#loader_form").fadeIn();
	};

	function iframe_stopLoading() {
		$('[data-loader="circle-side"]').fadeOut(); // will first fade out the loading animation
		$("#loader_form").delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
		$('body').delay(350).css({
			'overflow': 'visible'
		});
	};

    function checkUserResponses(id, permitted) {
        console.log("Fetching info for the user with id: " + currentUserID);

        iframe_startLoading();

        if (String(id) != "") {

            var d = new Date();
		    d.setHours(0);
		    d.setMinutes(0);
		    d.setSeconds(0);
		    d.setMilliseconds(0);

            var dateStr = String(Math.round(d.getTime()/1000));

            firebase.firestore().collection("submissions").doc(dateStr).collection("submissions").doc(String(id)).get().then((doc) => {
                let Q1 = doc.get("question1");
                let Q2 = doc.get("question2");
                let Q3 = doc.get("question4");
                let TEMP = doc.get("temperature");
    
                let tempInt = parseFloat(String(TEMP));
                console.log(tempInt);
                console.log(Q1);
                console.log(Q2);
                console.log(Q3);
    
                if (Q1.includes("Y")) {
                    iframe_stopLoading();
                    document.getElementById("main_header").innerHTML = "You are NOT permitted to come into work";
                    document.getElementById("main_paragraph").innerHTML = notpermittedText;
                } else if (Q2.includes("Y")) {
                    iframe_stopLoading();
                    document.getElementById("main_header").innerHTML = "You are NOT permitted to come into work";
                    document.getElementById("main_paragraph").innerHTML = notpermittedText;
                }  else if (Q3.includes("Y")) {
                    iframe_stopLoading();
                    document.getElementById("main_header").innerHTML = "You are NOT permitted to come into work";
                    document.getElementById("main_paragraph").innerHTML = notpermittedText;
                } else {
                    iframe_stopLoading();
                    if (tempInt >= 100.4) {
                        document.getElementById("main_header").innerHTML = "You are NOT permitted to come into work";
                        document.getElementById("main_paragraph").innerHTML = notpermittedText;
                    } else {
                        document.getElementById("main_header").innerHTML = "You are permitted to come into work";
                        document.getElementById("main_paragraph").innerHTML = "Thank you for submitting your Employee and Visitor COVID-19 Self Screening Questionnaire!";
                    };
                };
            }).catch((error) => {
                iframe_stopLoading();
                console.log("Failed to fetch user responses: " + error);
            });
        } else {
            iframe_stopLoading();
            console.log("User not found here: " + "Nothing set");
        };
        
    };
    
    
//})();