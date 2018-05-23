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
    function Service($rootScope, $location) {
        // Get search data
        this.getSearchData = function() {
            return $rootScope.promise.get('/api/search-data');
        };

        // Search
        this.doSearch = function(page, query) {
            console.log($location.path().split('/')[1]);
            if ($location.path().split('/')[1] === 'my-adverts') {
                return $rootScope.promise.post('/api/adverts/' + page, query);
            }
            return $rootScope.promise.post('/api/adverts/' + page, query);
        };
    }

    // Controller
    function Ctrl(
        AdvertsService,
        $rootScope,
        $scope,
        $routeParams,
        $location,
        $timeout,
        $route,
        $sanitize
    ) {
        console.log('Init Adverts Controller');
        console.log($routeParams);
        var first = true;

        // Location path change without reload
        var original = $location.path;
        $location.path = function(path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function() {
                    $route.current = lastRoute;
                });
                $timeout(un, 200);
            }
            return original.apply($location, [path]);
        };

        // Initial values for pagination
        $scope.currentPage = $routeParams.page || 1;
        $scope.advertsPerPage = $routeParams.size || '5';

        // Change page
        $scope.pageChanged = function(newPage, isPagination) {
            console.log('newPage', newPage);
            if (isPagination) {
                scrollTo(document.documentElement, document.querySelector('header').offsetHeight, 400);
            }
            delete $routeParams.companyId;
            var search = angular.copy($routeParams);
            delete search.page;
            if (!first) {
                search.size = $scope.advertsPerPage.toString();
            }
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
                    $location.path('/company/' + $routeParams.id, false);
                    $routeParams.companyId = $routeParams.id;
                    $routeParams.size = $scope.advertsPerPage.toString();
                    break;
                default:
                    $location.path('/adverts/' + newPage, false);
            }
            if (!isCompany) {
                delete $routeParams.page;
            } else {
                delete search.id;
            }
            $location.search(search);
            $scope.loaded = false;
            if ($routeParams.keywords) {
                var paramsCopy = angular.copy($routeParams);
                paramsCopy.keywords = $sanitize($scope.search.keywords);
                doSearch(newPage, paramsCopy);
            } else {
                doSearch(newPage, $routeParams);
            }
        };
        $scope.changeSize = function() {
            $scope.currentPage = 1;
        };

        // Get search data
        AdvertsService.getSearchData().then(function(res) {
            $scope.categories = res.data.categories;
            $scope.cities = res.data.cities;
            $scope.levels = res.data.levels;
            $scope.types = res.data.types;
            $scope.payments = res.data.payments;
            $scope.search = $routeParams;
            $scope.$apply();
            $scope.loaded = true;
            $scope.pageChanged($scope.currentPage);
        });

        function doSearch(num, query) {
            AdvertsService.doSearch(num, query)
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

        // ScrollTo animation
        function easeInOutQuad(t, b, c, d) {
            //t = current time
            //b = start value
            //c = change in value
            //d = duration
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        function scrollTo(element, to, duration) {
            var start = element.scrollTop,
                change = to - start,
                currentTime = 0,
                increment = 20;

            var animateScroll = function() {
                currentTime += increment;
                var val = easeInOutQuad(currentTime, start, change, duration);
                element.scrollTop = val;
                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };
            animateScroll();
        }
    }

    // Module
    angular
        .module('Adverts', ['ngRoute'])
        .config(Config)
        .service('AdvertsService', Service)
        .controller('Adverts', Ctrl);
})();
