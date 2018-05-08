(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/adverts', {
            templateUrl: 'views/adverts.html',
            controller: 'AdvertsCtrl',
            title: 'Обяви'
        });
    }

    // Service
    function Service($http, $timeout) {
        // Get adverts
        this.getAdverts = function(scope) {
            $http
                .get('/adverts')
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
    function Ctrl($scope, $http, $timeout, AdvertsService) {
        console.log('AdvertsCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        AdvertsService.getAdverts($scope);
    }

    // Module
    angular
        .module('App.Adverts', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('AdvertsService', Service)
        .controller('AdvertsCtrl', Ctrl);
})();
