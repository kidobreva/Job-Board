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
        $scope.status = {
            isopen: false
        };
        $scope.toggled = function(open) {
            console.log('Dropdown is now: ', open);
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
            var url = '/adverts/1?search=true';
            Object.keys($scope.search).forEach(function(prop) {
                if (typeof $scope.search[prop] !== 'object') {
                    url += '&' + prop + '=' + $scope.search[prop];
                } else {
                    url += '&' + prop + '=';
                    var arr = [];
                    Object.keys($scope.search[prop]).forEach(function(obj, i) {
                        arr[i] = $scope.search[prop][obj].id;
                    });
                    url += arr;
                }
            });
            url += '&' + 'salary=' + $scope.slider.minValue + ',' + $scope.slider.maxValue;
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
                var newsArr = [];
                var slides = 4;
                var items = 3;
                for (var i = 0; i < items * slides; ) {
                    var arr = [];
                    for (var j = 0; j < items; j++) {
                        // Parse the description
                        var parser = new DOMParser();
                        var dom = parser.parseFromString(news[i + j].description, 'text/html');
                        var decodedString = dom.body.textContent;

                        // Get the image
                        var div = document.createElement('div');
                        var description = angular.element(div).html(decodedString)[0];
                        var img = angular.element(description).find('img')[0];
                        news[i + j].description = img.outerHTML;

                        // Convert the timestamp
                        news[i + j].pubDate = new Date(news[i + j].pubDate).getTime();

                        arr[j] = news[i + j];
                        i++;
                    }
                    newsArr.push(arr);
                }
                $scope.news = newsArr;
                console.log('News', newsArr);
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
