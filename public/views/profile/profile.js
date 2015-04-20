app.controller("ProfileCtrl", function ($scope, $http, $rootScope, $location, $route, $q) {
    //$scope.folw = $rootScope.followerComment;
    //$rootScope.following = true;
    //finding all user for admin profile page
    $http.get("/rest/user")
    .success(function (users) {
        $scope.users = users;
    });

    //if it is logged in user
    if (!$rootScope.test) {
        $http.get('/loggedin')
        .success(function (user) {
            $http.get('/user', { params: { text: user.username } })
            .success(function (user) {
                $scope.user = user;
                $rootScope.test = false;
                $rootScope.currentUser = user;
                $scope.friend = false;
                $scope.hidemodel.PI = $rootScope.currentUser.hidePI || false;
                $scope.hidemodel.LI = $rootScope.currentUser.hideLI || false;
            });
            $scope.hidemodel = {};
            
            
        });

        
    }
        //if it is not logged in user
    else if ($rootScope.test) {
        var user = $rootScope.userI;
        $http.get('/user', { params: { text: user } })
        .success(function (user) {
            if (!user) {
                $scope.userex = true;
                $scope.user = null;
                
            }

            $scope.user = user;
            //if the user clicked his or her username direct user's profile
            if ($rootScope.currentUser.username == user.username) {
                $scope.friend = false;
                $location.url('/profile');
            }
                //when the user is accecing the other user
            else {
                $scope.friend = true;
            }
            $scope.hidemodel.PI = $rootScope.currentUser.hidePI;
            $scope.hidemodel.LI = $rootScope.currentUser.hideLI;
        });
        $rootScope.test = false;
    };


    //function to display the details of the comic book
    $scope.Display = function (title) {
        $http.get("/search", { params: { text: title } })
        .success(function (mangas) {
            $http.get('/detail', { params: mangas[0] })
            .success(function (response) {
                $rootScope.currentmanga = response;
                $location.url("/details");
            });
        });
    };


    //removing user for admin
    $scope.remove = function (User) {
        $http.delete('/rest/user/' + User._id)
        .success(function (users) {
            $scope.users = users;
        });
    };



    //removing comic book list from user's profile page
    $scope.Remove = function (list) {
        var text = list;;
        var user = $rootScope.currentUser.username;
        var clearread = $http.get('/clearread', { params: { text: text, user: user } });
        var clearwish = $http.get('/clearwish', { params: { text: text, user: user } });
        var clearcompl = $http.get('/clearcompl', { params: { text: text, user: user } });
        $q.all([clearread, clearwish, clearcompl]);

        $route.reload();
    };

    //function for follower
    $scope.follow = function (user) {
        var fol = user.username;
        var loggedUser = $rootScope.currentUser.username;
        $http.get('/follow', { params: { loguser: loggedUser, followname: fol } })
            .success(function (response) {
                $rootScope.test = true;
                $rootScope.following = true;
                $route.reload();
            });
    };


    //function to go into following user profile
    $scope.GoUser = function (follower) {
        $rootScope.userI = follower;
        $rootScope.test = true;
        $rootScope.following = true;
        $location.url("/profileother");
    };

    $scope.unfollow = function (user) {
        var unfol = user.username;
        var loggedUser = $rootScope.currentUser.username;
        $http.get('/unfollow', { params: { loguser: loggedUser, followname: unfol } })
        .success(function (response) {
            //$rootScope.followerComment = false;
            $rootScope.following = false;
            $rootScope.test = true;
            $route.reload();
        });
    };

    
    $scope.hidepi = function () {
        var user = $rootScope.currentUser.username;
        var hide = $scope.hidemodel.PI;
        $http.get('/hidepi', { params: { hide: hide, user: user } })
        .success(function (response) {
            //$route.reload();
        });

    };


    $scope.hideli = function () {
        var user = $rootScope.currentUser.username;
        var hide = $scope.hidemodel.LI;

        $http.get('/hideli', { params: { hide: hide, user: user } })
        .success(function (response) {
            //$route.reload();
        });
    };
});