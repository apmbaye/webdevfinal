var app = angular.module('Passport', ['ngRoute']);

app.config(function ($routeProvider) {
    //root provider for ng-view section for html
    $routeProvider
         .when('/', {
             templateUrl: '/views/home/home.html',
             controller: 'HomeCtrl'
         })
         .when('/home', {
             templateUrl: '/views/home/home.html',
             controller: 'HomeCtrl'
         })
         .when('/details', {
             templateUrl: '/views/details/details.html',
             controller: 'DetailsCtrl'
         })
        .when('/profile', {
            templateUrl: '/views/profile/profile1.html',
            controller: 'ProfileCtrl',
            resolve: {
                logincheck: checkLoggedin
            }
        })
        .when('/register', {
            templateUrl: '/views/Registration/registration.html',
            controller: 'RegisterCtrl'
        })
        .when('/profileother', {
            templateUrl: '/views/profile/profile1.html',
            controller: 'ProfileCtrl'
        })
		.when('/about', {
		    templateUrl: '/views/about/about.html',

		})
        .when('/search', {
            templateUrl: '/views/search/search.html',
            controller: 'SearchCtrl'
        })
        
        .otherwise({
            redirectTo: '/home'
        })
});

//to check if the user is logged in
var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0') {
            $rootScope.currentUser = user;
            deferred.resolve();
        }
            // User is Not Authenticated not logged in
        else {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');//redirection to login page if it is not logged in
        }
    });

    return deferred.promise;
};

//filter to display the comment in most recent order
app.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});
//controllr for nav bar
app.controller("NavCtrl", function ($scope, $http, $location, $rootScope, $route) {
    $scope.logout = function () {//direct to home page after logging out
        $http.post("/logout")
        .success(function () {
            $rootScope.currentUser = null;//global scope
            $location.url("/home");//logout to send back home
        });
    }
    //function for search at the nav bar
    $scope.search = function (textsearch) {
        $http.get("/search", { params: { text: textsearch } })
        .success(function (mangas) {
            $rootScope.textsea = $scope.textsearch;
            $scope.textsearch = '';
            $rootScope.searchresults = mangas;

            if ($location.path() == "/search")
                $route.reload();
            $location.url("/search");//logout to send back home

        });
    }


});
