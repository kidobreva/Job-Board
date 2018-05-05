angular.module('App.AddAdvert', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/add-advert', {
    templateUrl: 'views/add-advert.html',
    controller: 'AddAdvertCtrl'
  });
}])

.controller('AddAdvertCtrl', [function() {
  console.log('AddAdvertCtrl');
}]);
