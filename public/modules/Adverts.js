(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/adverts/:page', {
            templateUrl: 'views/adverts.html',
            controller: 'Adverts',
            title: 'Обяви'
        });
    }

    // Service
    function Service($rootScope) {
        // Get adverts
        this.getAdverts = function(page, size) {
            return $rootScope.promise.get('/api/adverts/' + page + '?size=' + (size || 5));
        };
    }
    // Controller
    function Ctrl(AdvertsService, $scope, $timeout, $routeParams, $location) {
        console.log('Init Adverts Controller');
        $scope.currentPage = $routeParams.page;

        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Get adverts
        AdvertsService.getAdverts($routeParams.page, $routeParams.size)
            .then(function(advertsArr) {
                $scope.maxSize = +advertsArr.data.len;
                $scope.totalItems = advertsArr.data.size;
                $scope.adverts = advertsArr.data.adverts;
                $scope.loaded = true;
                $scope.timeout = false;
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.log(err);
            });

        $scope.changePage = function() {
            $scope.adverts = null;
            $scope.loaded = false;
            AdvertsService.getAdverts($scope.currentPage, $routeParams.size)
                .then(function(advertsArr) {
                    $scope.adverts = advertsArr.data.adverts;
                    $scope.maxSize = +advertsArr.data.len;
                    $scope.totalItems = advertsArr.data.size;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                })
                .catch(function(err) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    console.log(err);
                });

            // $location.path('/adverts/' + $scope.currentPage);
        };
    }

    // Module
    angular
        .module('Adverts', ['ngRoute'])
        .config(Config)
        .service('AdvertsService', Service)
        .controller('Adverts', Ctrl);
})();
