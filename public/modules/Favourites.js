(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/favourites', {
            templateUrl: 'views/favourites.html',
            controller: 'Favourites',
            title: 'Любими обяви'
        });
    }

    // Service
    function Service($rootScope) {
        // Get favourites
        this.getFavourites = function() {
            return $rootScope.promise.get('/api/profile');
        };
    }

    // Controller
    function Ctrl(FavouritesService, $scope, $timeout, $rootScope, $location) {
        console.log('Init Favourites Controller');

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'USER') {
                    $location.path('/home');
                } else {
                    FavouritesService.getFavourites()
                        .then(function(response) {
                            console.log(response);
                            $scope.favourites = response.data.favourites;
                            $scope.loaded = true;
                            $scope.timeout = false;
                        })
                        .catch(function(err) {
                            $scope.loaded = true;
                            $scope.timeout = false;
                            console.error(err.data);
                        });

                    // Show loading wheel if needed after 1 second
                    $timeout(function() {
                        if (!$scope.loaded) {
                            $scope.timeout = true;
                        }
                    }, 1000);
                }
            })
            // If there's no user
            .catch(function() {
                // Redirect to the login
                $location.path('/login');
            });
    }

    // Module
    angular
        .module('Favourites', ['ngRoute'])
        .config(Config)
        .service('FavouritesService', Service)
        .controller('Favourites', Ctrl);
})();
