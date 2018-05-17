(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/my-adverts/:page', {
            templateUrl: 'views/myAdverts.html',
            controller: 'MyAdverts',
            title: 'Моите Обяви'
        });
    }

    // Service
    function Service($rootScope) {
        // Get adverts
        this.getAdverts = function() {
            return $rootScope.promise.get('/api/search?companyId=' + $rootScope.user.id);
        };
    }

    // Controller
    function Ctrl(MyAdvertsService, $rootScope, $scope, $timeout, $routeParams, $location) {
        console.log('Init Adverts Controller');
        $scope.currentPage = $routeParams.page;

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'COMPANY') {
                    $location.path('/home');
                } else {
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
                $location.path('/auth');
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
