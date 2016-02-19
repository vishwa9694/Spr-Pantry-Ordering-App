/**
 * Created by anuprai on 18/02/16.
 */




    function getuserdetail(googleUser) {

        console.log("Yello");
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        document.getElementById("connectedcidntfuxpsev").innerHTML="Sign-out";
        console.log(document.getElementById("signin-but")[0].style.background);

        //console.log('Email: ' + profile.getEmail());


        }
    function onSuccess(googleUser) {
        console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
        document.getElementById("my-signin2").style.display="none";
        profile=googleUser.getBasicProfile();
        displayuser(profile);
    }
    function onFailure(error) {
        console.log(error);

    }


    function renderButton() {
        gapi.signin2.render('my-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 200,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
        });
document.getElementById("my-signin2").style.display="block";
    }
    function signOut() {
       console.log("yolo");
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });

        document.getElementsByClassName("user-details")[0].style.display="none";
        document.getElementById("my-signin2").style.display="inline-block";
        document.getElementsByClassName("sign-out")[0].style.display="none";

    }
    function displayuser(profile){

        document.getElementById("ui__name").innerHTML=profile.getName().split(" ")[0];
        document.getElementById("ui__pic").src=profile.getImageUrl();
        document.getElementsByClassName("user-details")[0].style.display="inline-block";
        document.getElementsByClassName("sign-out")[0].style.display="inline-block";

        console.log(profile);


    }



