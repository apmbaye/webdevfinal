app.controller("SearchCtrl", function ($scope, $http, $rootScope,$location) {
    //function to search comic books
    $scope.display = function (manga) {
        $http.get('/detail', { params: manga })
        .success(function (response) {
            $rootScope.currentmanga = response;
            $location.url("/details");
        });
    }
    $scope.textsearch = $rootScope.textsea;
    $scope.results = $rootScope.searchresults;
    $rootScope.searchresults = '';

});