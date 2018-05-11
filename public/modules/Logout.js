(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'views/logout.html',
            controller: 'Logout'
        });
    }

    // Controller
    function Ctrl($rootScope, $http, $window) {
        console.log('LogoutCtrl');

        // Logout
        $http
            .get('/api/logout')
            .then(function(response) {
                if (response.status === 200) {
                    $rootScope.user = null;
                    $rootScope.isLogged = false;
                    console.log('Logged out!');
                    $window.location.href = '#!/home';
                }
            })
            .catch(function(err) {
                console.error(err.data);
            });
    }

    // Module
    angular
        .module('Logout', ['ngRoute'])
        .config(Config)
        .controller('Logout', Ctrl);
})();
