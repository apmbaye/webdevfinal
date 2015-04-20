
app.controller("DetailsCtrl", function ($scope, $rootScope, $http, $route, $location, $q) {
    $scope.value = 'manga';


    $scope.manga = $rootScope.currentmanga;
    $scope.testexist = angular.isDefined($scope.manga);

    if ($scope.testexist)
        $scope.number = Number($rootScope.currentmanga.ratings);

    // check if user exists
    if (angular.isDefined($rootScope.currentUser)){
        if (jQuery.inArray($scope.manga.title, $rootScope.currentUser.reading) > -1)
            $scope.value = 'manga1';
        else if (jQuery.inArray($scope.manga.title, $rootScope.currentUser.wishing) > -1)
            $scope.value = 'manga2';
        else if (jQuery.inArray($scope.manga.title, $rootScope.currentUser.complete) > -1)
            $scope.value = 'manga3';
    }

    // add manga to read list
    $scope.read = function (value) {
        var text = $scope.manga.title;
        var user = $rootScope.currentUser.username;
        var clearwish = $http.get('/clearwish', { params: { text: text, user: user } });
        var clearcompl = $http.get('/clearcompl', { params: { text: text, user: user } });
        var read = $http.get('/read', { params: { text: text, user: user } });
        $q.all([clear, clearwish, read]);
    }

    // add manga to wish list
    $scope.wish = function (value) {
        var text = $scope.manga.title;
        var user = $rootScope.currentUser.username;
        var clearcompl = $http.get('/clearcompl', { params: { text: text, user: user } });
        var clearread = $http.get('/clearread', { params: { text: text, user: user } });
        var wish = $http.get('/wish', { params: { text: text, user: user } });
        $q.all([clearread, clearcompl, wish]);
    }


    // add manga to complete list
    $scope.complete = function (value) {
        var text = $scope.manga.title;
        var user = $rootScope.currentUser.username;
        var clearwish = $http.get('/clearwish', { params: { text: text, user: user } });
        var clearread = $http.get('/clearread', { params: { text: text, user: user } });
        var compl = $http.get('/compl', { params: { text: text, user: user } });
        $q.all([clearread, clearwish, compl]);
    }


    // remove manga from all list
    $scope.clear = function (value) {
        $scope.value = 'manga';
        var text = $scope.manga.title;
        var user = $rootScope.currentUser.username;
        var clearread = $http.get('/clearread', { params: { text: text, user: user } });
        var clearwish = $http.get('/clearwish', { params: { text: text, user: user } });
        var clearcompl = $http.get('/clearcompl', { params: { text: text, user: user } });
        $q.all([clearread, clearwish, clearcompl]);
    }



    // Star rating 
    $("#input-1").rating({
        starCaptions: function (val) {
            if (val < 20) {
                return 'Last Resort';
            }
            else if (val < 40) {
                return 'Decent Read';
            }
            else if (val < 60) {
                return 'Nice Read';
            }
            else if (val < 80) {
                return 'Highly Recommended';
            } else {
                return 'Must Read';
            }
        },
        starCaptionClasses: function (val) {
            if (val < 20) {
                return 'label label-danger';
            }
            else if (val < 40) {
                return 'label label-warning';
            }
            else if (val < 60) {
                return 'label label-info';
            }
            else if (val < 80) {
                return 'label label-primary';
            } else {
                return 'label label-success';
            }
        },
        min: 0,
        max: 100,
        step: 1,
        size: 'xs',
        stars: 10,
        disabled: true,
        showClear: false
    });
    $('#input-1').rating('update', $scope.number);

    // add a comment
    $scope.commenting = function (txtcomment, title) {
        $http.get('/loggedin')
        .success(function (user) {
            var username = user.username;

            $http.get('/addComment', { params: { title: title, usernames: username, txtcomment: txtcomment } })
            .success(function (response) {
                $http.get("/search", { params: { text: response.title } })
                .success(function (mangas) {
                    $scope.textsearch = '';
                    $rootScope.searchresults = mangas;

                    $http.get('/detail', { params: mangas[0] })
                    .success(function (response) {
                        $rootScope.currentmanga = response;
                        $route.reload();
                    });
                });

            });
        });

    }

    // display user 
    $scope.dispUser = function (user) {
        $rootScope.userI = user;
        $rootScope.test = true;
        var tempU = $rootScope.currentUser.username;
        $http.get('/followingcheck', { params: { text1: tempU, foUser: user } })
        .success(function (response) {
            
            $rootScope.following = true;
        })
        .error(function (response) {//when the username already exist
            
            $rootScope.following = false;
         });
        $location.url("/profileother");
    }
});

