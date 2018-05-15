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
        this.getAdverts = function(page) {
            return $rootScope.promise.get('/api/adverts/' + page);
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
        AdvertsService.getAdverts($routeParams.page)
            .then(function(advertsArr) {
                $scope.maxSize = 10;
                $scope.adverts = advertsArr.data.adverts;
                $scope.totalItems = advertsArr.data.len;
                $scope.loaded = true;
                $scope.timeout = false;
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.log(err);
            });

        $scope.changePage = function() {
            $location.path('/adverts/' + $scope.currentPage);
        };
    }

    // Module
    angular
        .module('Adverts', ['ngRoute'])
        .config(Config)
        .service('AdvertsService', Service)
        .controller('Adverts', Ctrl);
})();
