(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/search', {
            templateUrl: 'views/search.html',
            controller: 'Search',
            title: 'Търсене на обяви'
        });
    }

    // Service
    function Service($rootScope, $http, $routeParams) {
        // Query
        var query = '/api/search?';
        if ($routeParams.category !== 'undefined') {
            query += 'category=' + $routeParams.category + '&';
        }
        if ($routeParams.city !== 'undefined') {
            query += 'city=' + $routeParams.city + '&';
        }

        // Search
        this.search = function() {
            return $rootScope.promise.post(query);
        };
    }

    // Controller
    function Ctrl(SearchService, $scope, $timeout) {
        console.log('Init Search Controller');

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        SearchService.search()
            .then(function(adverts) {
                console.log(adverts);
                $scope.adverts = adverts.data;
                $scope.loaded = true;
                $scope.timeout = false;
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.log(err);
            });
    }

    // Module
    angular
        .module('Search', ['ngRoute'])
        .config(Config)
        .service('SearchService', Service)
        .controller('Search', Ctrl);
})();
