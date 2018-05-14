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
        function getAdverts() {
            AdvertsService.getAdverts($routeParams.page)
                .then(function(advertsArr) {
                    console.log(advertsArr);
                    $scope.maxSize = 10;
                    $scope.adverts = advertsArr.data.adverts;
                    $scope.totalItems = advertsArr.data.len;
                    // $scope.advertsArr = advertsArr.data.adverts;
                    $scope.loaded = true;
                    $scope.timeout = false;
                })
                .catch(function(err) {
                    $scope.loaded = true;
                    $scope.timeout = false;
                    console.log(err);
                });
        }
        getAdverts();

        // Pagination
        function paginate(arr, size, num) {
            // return arr.slice((num - 1) * size, num * size);
        }

        $scope.changePage = function() {
            // $scope.adverts = paginate(
            //     $scope.advertsArr,
            //     $scope.maxSize,
            //     $scope.currentPage
            // );
            $location.path('/adverts/' + $scope.currentPage);
            // console.log('Page changed to: ' + $scope.currentPage);
            // getAdverts();
        };
    }

    // Module
    angular
        .module('Adverts', ['ngRoute'])
        .config(Config)
        .service('AdvertsService', Service)
        .controller('Adverts', Ctrl);
})();
