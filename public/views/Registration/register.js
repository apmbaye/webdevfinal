app.controller("RegisterCtrl", function ($location, $scope, $http, $rootScope) {
    
    $scope.testusername = false;
    $scope.existuser = false;
    $scope.faillogin = false;
    //function for registration
    $scope.register = function (user) {
        //Verify passwords are the same and notify user
        if (user.password == user.password2 && user.lastName.length != 0 && user.firstName.length != 0 && user.username.length != 0 && user.email.length != 0)
        {
            $http.post('/register', user)
            .success(function (response) {
               $rootScope.currentUser = response;
               $('body').removeClass('modal-open');
               $(document.body).css('padding-right', 0);
               $location.url("/profile");
            })
            .error(function (response) {//when the username already exist
                $scope.existuser = true;    
            });
        }
    };

    // clear registration modal if you do not wish to submit info
    $scope.clear = function (newuser) {
        if ($scope.newuser) {
            $scope.newuser.firstName = '';
            $scope.newuser.lastName = '';
            $scope.newuser.email = '';
            $scope.newuser.username = '';
            $scope.newuser.password = '';
            $scope.newuser.password2 = '';
        }
    };
    //function for login
    $scope.login = function (user) {
        $http.post('/login', user)
        .success(function (response) {
            $rootScope.currentUser = response;
            $('body').removeClass('modal-open');
            $(document.body).css('padding-right', 0);
            $location.url("/profile");
        })
        .error(function (response) {//when the login fail
            $scope.faillogin = true;
        });
    };
});