(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/my-adverts/:page', {
            templateUrl: 'views/myAdverts.html',
            controller: 'MyAdverts',
            title: 'Моите Обяви',
            resolve: {
                isCompnany: function($rootScope, $location) {
                    if (!$rootScope.user || $rootScope.user.role !== 'COMPANY') {
                        $location.path('/home');
                        // $rootScope.$apply();
                    }
                }
            }
        });
    }

    // Service
    function Service($rootScope) {
        // Get adverts
        this.getAdverts = function(page) {
            return $rootScope.promise.get('/api/search?companyId=' + $rootScope.user.id);
        };
    }

    // Controller
    function Ctrl(MyAdvertsService, $scope, $timeout, $routeParams, $location) {
        console.log('Init Adverts Controller');
        $scope.currentPage = $routeParams.page;
        // Loader
        $timeout(function() {
            if (!$scope.loaded) {
                $scope.timeout = true;
            }
        }, 1000);

        // Get adverts
        MyAdvertsService.getAdverts($routeParams.page)
            .then(function(advertsArr) {
                console.log(advertsArr);
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
            $location.path('/my-adverts/' + $scope.currentPage);
        };
    }

    // Module
    angular
        .module('MyAdverts', ['ngRoute'])
        .config(Config)
        .service('MyAdvertsService', Service)
        .controller('MyAdverts', Ctrl);
})();
