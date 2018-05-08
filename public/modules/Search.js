(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/search', {
            templateUrl: 'views/search.html',
            controller: 'SearchCtrl',
            title: 'Търсене на обяви'
        });
    }

    // Service
    function Service($routeParams, $http) {
        // Query
        var query = '/search?';
        if ($routeParams.category !== 'undefined') {
            query += 'category=' + $routeParams.category + '&';
        }
        if ($routeParams.city !== 'undefined') {
            query += 'city=' + $routeParams.city + '&';
        }

        // Search
        this.search = function(scope) {
            $http
                .get(query)
                .then(function(adverts) {
                    console.log(adverts);
                    scope.adverts = adverts.data;
                    scope.loaded = true;
                    scope.timeout = false;
                })
                .catch(function(err) {
                    scope.loaded = true;
                    scope.timeout = false;
                    console.log(err);
                });
        };
    }

    // Controller
    function Ctrl($scope, $timeout, SearchService) {
        console.log('SearchCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        SearchService.search($scope);
    }

    // Module
    angular
        .module('App.Search', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('SearchService', Service)
        .controller('SearchCtrl', Ctrl);
})();
