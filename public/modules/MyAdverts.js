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
        this.getAdverts = function(page, size) {
            return $rootScope.promise.get(
                '/api/my-adverts/search?companyId=' +
                    $rootScope.user.id +
                    '&page=' +
                    page +
                    '&size=' +
                    (size || 5)
            );
        };
    }

    // Controller
    function Ctrl(
        MyAdvertsService,
        SearchService,
        $rootScope,
        $scope,
        $timeout,
        $routeParams,
        $location,
        $route
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
            scrollTo(document.documentElement, header.scrollHeight, 400);
            getResultsPage(newPage);
        };
        $scope.beforeChangeSize = function() {
            $scope.pagination.current = 1;
        };

        // Check for current user
        $rootScope
            .getCurrentUser()
            .then(function(currentUser) {
                // Check for the user's role
                if (currentUser.role !== 'COMPANY') {
                    $location.path('/home');
                } else {
                    // Get search data
                    SearchService.getSearchData().then(function(res) {
                        $scope.categories = res.data.categories;
                        $scope.cities = res.data.cities;
                        $scope.payments = res.data.payments;
                        $scope.$apply();
                        doSearch($scope.currentPage, $scope.advertsPerPage);
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

        var header = document.querySelector('header');

        function doSearch(num, size) {
            console.log(num, size);
            // Get adverts
            MyAdvertsService.getAdverts(num, size)
                .then(function(result) {
                    console.log(result);
                    $scope.adverts = result.data.adverts;
                    $scope.totalAdverts = result.data.len;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                })
                .catch(function() {
                    $scope.adverts.length = 0;
                    $scope.loaded = true;
                    $scope.timeout = false;
                    $scope.$apply();
                });
        }

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

        function getResultsPage(pageNumber) {
            $location.search({
                size: $scope.advertsPerPage.toString()
            });
            $location.path('/my-adverts/' + pageNumber, false);
            $scope.loaded = false;
            doSearch(pageNumber, $scope.advertsPerPage);
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
        .module('MyAdverts', ['ngRoute'])
        .config(Config)
        .service('MyAdvertsService', Service)
        .controller('MyAdverts', Ctrl);
})();
