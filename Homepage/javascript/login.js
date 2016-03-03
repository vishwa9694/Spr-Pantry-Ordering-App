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
    };
    function onSuccess(googleUser) {
        var email=googleUser.getBasicProfile().getEmail();
        email=email.split("@")[1];

        if(email==="sprinklr.com")
        {
            document.getElementById("my-signin2").style.display = "none";
            profile = googleUser.getBasicProfile();
            login.getuserdetail(googleUser);
            login.displayuser(profile);
        }
        else
        {
            login.signOut();
            alert("You must use a sprinklr.com id to login");
        }
        controllerMain.init();

    };
    function onFailure(error) {
        console.log(error);

    };

login={

    user:new Object(),
    getuserdetail:function (googleUser) {
        var profile = googleUser.getBasicProfile();
        this.user.id=profile.getId();
        this.user.name=profile.getName();
        this.user.img=profile.getImageUrl();
        this.user.email=profile.getEmail();
    },    
    signOut :function() {
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
    },

};

