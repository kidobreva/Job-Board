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
    function Service($rootScope) {
        // Get adverts
        this.getAdverts = function() {
            return $rootScope.promise('GET', '/api/adverts');
        };
    }

    // Controller
    function Ctrl(AdvertsService, $scope, $timeout) {
        console.log('AdvertsCtrl');

        // Loader
        $scope.loaded = false;
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Get adverts
        AdvertsService.getAdverts()
            .then(function(advertsArr) {
                advertsArr = advertsArr.data;
                $scope.maxSize = 10;
                $scope.adverts = advertsArr.slice(0, $scope.maxSize);
                $scope.totalItems = advertsArr.length;
                $scope.advertsArr = advertsArr;
                $scope.loaded = true;
                $scope.timeout = false;
            })
            .catch(function(err) {
                $scope.loaded = true;
                $scope.timeout = false;
                console.log(err);
            });

        // Pagination
        function paginate(arr, size, num) {
            return arr.slice((num - 1) * size, num * size);
        }

        $scope.changePage = function() {
            $scope.adverts = paginate(
                $scope.advertsArr,
                $scope.maxSize,
                $scope.currentPage
            );
            console.log('Page changed to: ' + $scope.currentPage);
        };
    }

    // Module
    angular
        .module('App.Adverts', ['ngRoute'])
        .config(['$routeProvider', Config])
        .service('AdvertsService', Service)
        .controller('AdvertsCtrl', Ctrl);
})();
