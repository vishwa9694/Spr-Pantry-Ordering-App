/*
 * Created by anuprai on 18/02/16.
 */
login={


    getuserdetail:function (googleUser) {


        console.log("Yello");
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        this.user.id=profile.getId();
        console.log('Name: ' + profile.getName());
        this.user.name=profile.getName();
        console.log('Image URL: ' + profile.getImageUrl());
        this.user.img=profile.getImageUrl();
        console.log('Email: ' + profile.getEmail());
        this.user.email=profile.getEmail();
        //controller.init();
        //document.getElementById("connectedcidntfuxpsev").innerHTML="Sign-out";
        //console.log(document.getElementById("signin-but")[0].style.background);

        //console.log('Email: ' + profile.getEmail());


        },

    onSuccess:function (googleUser) {
        console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
        var email=googleUser.getBasicProfile().getEmail();
        email=email.split("@")[1];

        if(email==="sprinklr.com")
        {
            document.getElementById("my-signin2").style.display = "none";
            profile = googleUser.getBasicProfile();
            this.getuserdetail(googleUser);
            this.displayuser(profile);
        }
        else
        {
            this.signOut();
            alert("You must use a sprinklr.com id to login");
        }
    },
    onFailure:function (error) {
        console.log(error);

    },


    renderButton:function() {
        console.clear();
        console.log("login is here:");
        gapi.signin2.render('my-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 200,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': this.onSuccess,
            'onfailure': this.onFailure
        });
        document.getElementById("my-signin2").style.display="block";
    },
    signOut :function() {
       console.log("yolo");
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });

        document.getElementById("my-signin2").style.display="inline-block";
        document.getElementsByClassName("header-text")[0].style.display="none";

    },
    displayuser:function(profile){

        document.getElementById("ui__name").innerHTML=profile.getName().split(" ")[0];
        if(profile.getImageUrl()===undefined)
            document.getElementById("ui__pic").src="http://i.stack.imgur.com/mFZLk.png";
        else
            document.getElementById("ui__pic").src=profile.getImageUrl();

        document.getElementsByClassName("header-text")[0].style.display="inline-block";

        console.log(profile);


    },

};

