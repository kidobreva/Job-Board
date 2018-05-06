var ContactsModule = angular.module('App.Contacts', ['ngRoute']);

ContactsModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/contacts', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl',
        title: 'Контакти'
    })
}]);

ContactsModule.controller('ContactsCtrl', [function() {
    console.log('ContactsCtrl');
  }]);