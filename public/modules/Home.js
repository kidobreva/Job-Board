(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'Home',
            title: 'Job Board - Начало'
        });
    }

    // Controller
    function Ctrl(AdvertsService, $scope, $location, $rootScope, $sce) {
        console.log('Init Home Controller');

        // Carousel
        $scope.myInterval = 10000;
        $scope.noWrapSlides = false;
        $scope.active = 0;

        // Initial values for search panel
        $scope.search = {
            keywords: ''
        };
        $scope.selectedLevels = {};
        $scope.selectedTypes = {};
        $scope.status = {
            isopen: false
        };
        $scope.toggled = function(open) {
            // console.log('Dropdown is now: ', open);
        };
        $scope.labels = {
            itemsSelected: 'избрани',
            selectAll: 'избери всички',
            unselectAll: 'премахни всички',
            search: 'търси...',
            select: 'избери'
        };
        $scope.slider = {
            minValue: 200,
            maxValue: 5000,
            options: {
                // selectionBarGradient: {
                //     from: 'white',
                //     to: '#FC0'
                // },
                floor: 200,
                ceil: 5000,
                translate: function(value, sliderId, label) {
                    switch (label) {
                        case 'model':
                            return 'от <b>' + value + '</b>';
                        case 'high':
                            return 'до <b>' + value + '</b>';
                        default:
                            return value;
                    }
                }
            }
        };

        // Search
        $scope.doSearch = function() {
            var url = '';
            Object.keys($scope.search).forEach(function(prop) {
                if (typeof $scope.search[prop] !== 'object') {
                    // Keywords
                    if ($scope.search[prop]) {
                        url += '&' + prop + '=' + $scope.search[prop];
                    }
                } else {
                    // Category and city
                    url += '&' + prop + '=';
                    var arr = [];
                    Object.keys($scope.search[prop]).forEach(function(obj, i) {
                        arr[i] = $scope.search[prop][obj].id;
                    });
                    url += arr;
                }
            });

            // Salary
            if (
                $scope.slider.minValue !== $scope.slider.options.floor ||
                $scope.slider.maxValue !== $scope.slider.options.ceil
            ) {
                url += '&' + 'salary=' + $scope.slider.minValue + ',' + $scope.slider.maxValue;
            }

            // Levels
            var levelId = '';
            Object.keys($scope.selectedLevels).forEach(function(level) {
                if ($scope.selectedLevels[level]) {
                    levelId += level + ',';
                }
            });
            if (levelId) {
                url += '&' + 'levelId=' + levelId.slice(0, -1);
            }

            // Types
            var typeId = '';
            Object.keys($scope.selectedTypes).forEach(function(type) {
                if ($scope.selectedTypes[type]) {
                    typeId += type + ',';
                }
            });
            if (typeId) {
                url += '&' + 'typeId=' + typeId.slice(0, -1);
            }

            url = url ? '/adverts/1?search=true' + url : '/adverts/1';
            $location.url(url);
        };

        // Get search data
        AdvertsService.getSearchData().then(function(response) {
            $scope.categories = response.data.categories;
            $scope.cities = response.data.cities;
            $scope.levels = response.data.levels;
            $scope.types = response.data.types;
            $scope.loaded = true;
            $scope.$apply();

            // Get News
            $rootScope.promise.get('/api/news').then(res => {
                var news = res.data.rss.channel.item;
                news.forEach(function(el) {
                    // Parse the description
                    var parser = new DOMParser();
                    var dom = parser.parseFromString(el.description, 'text/html');
                    var decodedString = dom.body.textContent;

                    // Get the image
                    var div = document.createElement('div');
                    var description = angular.element(div).html(decodedString)[0];
                    var img = angular.element(description).find('img')[0];
                    el.description = img.outerHTML;

                    // Convert the timestamp
                    el.pubDate = new Date(el.pubDate).getTime();
                });
                var newsArr = [];
                var slides = 4;
                var items = 3;
                for (var i = 0, len = news.length; i < slides; i++) {
                    if (i !== len - 1) {
                        newsArr.push(news.slice(items * i, slides * items / slides * (i + 1)));
                    }
                }
                $scope.news = newsArr;
                // console.log('News', newsArr);
                $scope.$apply();
            });
        });
    }

    // Module
    angular
        .module('Home', ['ngRoute'])
        .config(Config)
        .controller('Home', Ctrl);
})();

angular
    .module('Carousel', ['ngRoute'])
    .controller('CarouselCtrl', function(AdvertsService, $scope, $location, $rootScope) {
        // console.log('Init Carousel');
        // Get Partners
        $rootScope.promise.get('/api/partners').then(res => {
            var partners = res.data;
            var partnersArr = [];
            var slides = 2;
            var items = 4;
            for (var i = 0; i < slides; i++) {
                // console.log(items * i);
                // console.log(slides * items / slides);
                if (i === slides - 1) {
                    partnersArr.push(partners.slice(slides * items / slides));
                } else {
                    partnersArr.push(partners.slice(items * i, slides * items / slides));
                }
            }
            $scope.partners = partnersArr;
            // console.log('Parters', partnersArr);
            // $scope.$apply();
        });
    });
