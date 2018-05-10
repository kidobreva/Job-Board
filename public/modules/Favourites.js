(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/favourites', {
            templateUrl: 'views/favourites.html',
            controller: 'FavouritesCtrl',
            title: 'Любими обяви'
        });
    }

    // Service
    function Service($rootScope) {
        // Get favourites
        this.getFavourites = function() {
            return $rootScope.promise('GET', '/api/profile');
        };
    }

    // Controller
    function Ctrl(FavouritesService, $scope, $timeout) {
        console.log('FavouritesCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        FavouritesService.getFavourites()
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.favourites = response.data.favourites;
                }
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.error(err.data);
            });
    }

    // Module
    angular
        .module('App.Favourites', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('FavouritesService', Service)
        .controller('FavouritesCtrl', Ctrl);
})();
