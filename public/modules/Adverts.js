(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/adverts/:page', {
            templateUrl: 'views/adverts.html',
            controller: 'Adverts',
            title: 'Обяви',
            reloadOnSearch: false
        });
        $routeProvider.when('/my-adverts/:page', {
            templateUrl: 'views/my-adverts.html',
            controller: 'Adverts',
            title: 'Моите Обяви',
            reloadOnSearch: false
        });
        $routeProvider.when('/favourites/:page', {
            templateUrl: 'views/my-adverts.html',
            controller: 'Adverts',
            title: 'Наблюдавани обяви',
            reloadOnSearch: false
        });
        $routeProvider.when('/applied/:page', {
            templateUrl: 'views/my-adverts.html',
            controller: 'Adverts',
            title: 'Кандидатствания',
            reloadOnSearch: false
        });
    }

    // Service
    function Service($rootScope) {
        // Get search data
        this.getSearchData = function() {
            return $rootScope.promise.get('/api/search-data');
        };

        // Search
        this.doSearch = function(page, query, size) {
            if (size) {
                query.size = size;
            }
            query.page = +page;
            return $rootScope.promise.post('/api/adverts', query);
        };

        this.removeFavourite = function(id) {
            return $rootScope.promise.delete('/api/favourite/' + id);
        };
    }

    // Controller
    function Ctrl(AdvertsService, $rootScope, $scope, $routeParams, $location, $timeout) {
        console.log('Init Adverts Controller');
        var isFirstVisit = true;
        var isSize = false;

        // Initial values for pagination
        $scope.currentPage = $routeParams.page || 1;
        $scope.advertsPerPage = $routeParams.size || '5';
        $scope.changeSize = function(size) {
            // $scope.pageChanged(1, false, size);
            isSize = true;
        };

        // Change page
        $scope.pageChanged = function(newPage, isPagination, size) {
            console.log($scope.advertsPerPage);
            var search = angular.copy($routeParams);
            delete search.size;
            if (isSize) {
                search.size = $scope.advertsPerPage;
            }

            delete search.companyId;
            delete $routeParams.page;
            switch ($location.path().split('/')[1]) {
                case 'my-adverts':
                    $location.path('/my-adverts/' + newPage, false);
                    $routeParams.companyId = $rootScope.user.id;
                    $routeParams.size = $scope.advertsPerPage.toString();
                    break;
                case 'favourites':
                    $location.path('/favourites/' + newPage, false);
                    $routeParams.favourites = $rootScope.user.favourites;
                    $routeParams.size = $scope.advertsPerPage.toString();
                    break;
                case 'applied':
                    $location.path('/applied/' + newPage, false);
                    $routeParams.applied = $rootScope.user.applied;
                    $routeParams.size = $scope.advertsPerPage.toString();
                    break;
                case 'company':
                    var isCompany = true;
                    if (!isFirstVisit) {
                        $location.path('/company/' + $routeParams.id + '/page/' + newPage, false);
                    }
                    $routeParams.companyId = $routeParams.id;
                    // $routeParams.size = $scope.advertsPerPage.toString();
                    break;
                default:
                    $location.path('/adverts/' + newPage, false);
            }

            // Delete unused params
            delete search.page;
            if (!isCompany) {
                // delete $routeParams.page;
            } else {
                delete search.id;
            }

            // fake the url and do search
            console.log(search);
            $location.search(search);
            $scope.loaded = false;

            console.log($scope.advertsPerPage);
            doSearch(newPage, $routeParams, $scope.advertsPerPage);
            isFirstVisit = false;

            // animate scroll
            if (isPagination) {
                console.log('scroll');
                $rootScope.scrollTo(document.querySelector('header').offsetHeight, 400);
            }
        };

        // Get search data
        AdvertsService.getSearchData().then(function(res) {
            $scope.categories = res.data.categories;
            $scope.cities = res.data.cities;
            $scope.levels = res.data.levels;
            $scope.types = res.data.types;
            $scope.payments = res.data.payments;
            $scope.search = $routeParams;
            $scope.loaded = true;
            $scope.$apply();
            $scope.pageChanged($scope.currentPage);
        });

        function doSearch(num, query, size) {
            AdvertsService.doSearch(num, query, size)
                .then(function(result) {
                    console.log('Adverts', result);
                    $scope.adverts = result.data.adverts;
                    $scope.totalAdverts = result.data.totalAdverts;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                })
                .catch(function() {
                    $scope.adverts = null;
                    $scope.totalAdverts = 0;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                });

            // Loading wheel
            $timeout(function() {
                if (!$scope.loaded) {
                    $scope.timeout = true;
                }
            }, 1000);
        }

        //Delete adverts from favorites
        $scope.removeFavourite = function(id, index) {
            AdvertsService.removeFavourite(id).then(function(res) {
                console.log(res);
                $scope.adverts.splice(index, 1);
                $scope.$apply();
            });
        };
    }

    // Module
    angular
        .module('Adverts', ['ngRoute'])
        .config(Config)
        .service('AdvertsService', Service)
        .controller('Adverts', Ctrl);
})();
