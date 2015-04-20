app.controller("HomeCtrl", function ($location, $scope, $http, $rootScope) {
    $scope.showcoll = function () {
        $http.get('/searchall')
        .success(function (response) {
            $rootScope.searchresults = response;
            $location.url("/search");
        });
    };
});