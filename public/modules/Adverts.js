(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/adverts/:page', {
            templateUrl: 'views/adverts.html',
            controller: 'Adverts',
            title: 'Обяви',
            reloadOnSearch: false
        });
    }

    // Service
    function Service($rootScope) {
        this.doSearch = function(page, size, data) {
            if (data) {
                return $rootScope.promise.post(
                    '/api/adverts/search?page=' + page + '&size=' + size,
                    data
                );
            } else {
                return $rootScope.promise.get('/api/adverts/' + page + '?size=' + (size || 5));
            }
        };
    }

    // Controller
    function Ctrl(
        AdvertsService,
        SearchService,
        $scope,
        $timeout,
        $routeParams,
        $location,
        $route,
        $rootScope
    ) {
        console.log('Init Adverts Controller');

        // Initial values for pagination
        $scope.currentPage = $routeParams.page || 1;
        $scope.adverts = [];
        $scope.totalAdverts = 0;
        $scope.advertsPerPage = $routeParams.size || '5';
        $scope.pagination = {
            current: $scope.currentPage
        };
        $scope.pageChanged = function(newPage) {
            console.log(newPage);
            scrollTo(document.documentElement, document.querySelector('header').offsetHeight, 400);
            getResultsPage(newPage);
        };
        $scope.beforeChangeSize = function() {
            $scope.pagination.current = 1;
        };

        // Location path change without reload
        var original = $location.path;
        $location.path = function(path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function() {
                    $route.current = lastRoute;
                });
                un();
            }
            return original.apply($location, [path]);
        };

        $scope.searchAdvert = function() {
            $scope.isSearch = true;
            $scope.pagination.current = 1;
        };

        function doSearch(num, size, data) {
            AdvertsService.doSearch(num, size, data)
                .then(function(result) {
                    console.log(result);
                    $scope.adverts = result.data.adverts;
                    $scope.totalAdverts = result.data.size;
                    $scope.$apply();
                    $scope.loaded = true;
                    $scope.timeout = false;
                })
                .catch(function() {
                    $scope.adverts.length = 0;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                });
        }

        function getResultsPage(pageNumber) {
            $location.search({
                size: $scope.advertsPerPage.toString()
            });
            $location.path('/adverts/' + pageNumber, false);
            $scope.loaded = false;
            if ($scope.isSearch) {
                doSearch(pageNumber, $scope.advertsPerPage, $scope.search);
            } else {
                doSearch(pageNumber, $scope.advertsPerPage);
            }
            // Loading wheel
            $timeout(function() {
                if (!$scope.loaded) {
                    $scope.timeout = true;
                }
            }, 1000);
        }

        // Get search data
        SearchService.getSearchData().then(function(res) {
            $scope.categories = res.data.categories;
            $scope.cities = res.data.cities;
            $scope.levels = res.data.levels;
            $scope.types = res.data.types;
            $scope.payments = res.data.payments;
            $scope.$apply();
            $scope.loaded = true;
            getResultsPage($scope.currentPage);
        });

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
