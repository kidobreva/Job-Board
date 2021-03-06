(function() {
    // Config
    function Config($routeProvider) {
        $routeProvider.when('/contacts', {
            templateUrl: 'views/contacts.html',
            controller: 'Contacts',
            title: 'Контакти'
        });
    }

    // Service
    function Service($rootScope) {
        // Add message
        this.sendMessage = function(message) {
            console.log('Add message');
            return $rootScope.promise.post('/api/send-message', message);
        };
    }

    // Controller
    function Ctrl(SendMessageService, $scope) {
        console.log('Init Contacts Controller');

        // Send message
        $scope.sendMessage = function() {
            // Email validation
            if (!$scope.validateEmail($scope.message.email)) {
                console.log('Invalid email!');
            } else {
                if (!$scope.validatePhone($scope.message.phone)) {
                    console.log('Invalid email!');
                } else {
                    SendMessageService.sendMessage($scope.message)
                        .then(function() {
                            $scope.addAlert();
                            document.forms[0].reset();
                        })
                        .catch(function(err) {
                            console.error(err);
                        });
                }
            }
        };

        // Alerts
        $scope.alerts = [];
        $scope.addAlert = function() {
            $scope.alerts.length = 0;
            $scope.alerts.push({ type: 'primary', msg: 'Съобщението ви беше изпратено успешно!' });
            $scope.$apply();
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // Validations
        $scope.validateEmail = function() {
            var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(String($scope.message.email).toLowerCase());
        };
        $scope.validatePhone = function() {
            var regex = /^[0-9 +]*$/gm;
            return regex.test(Number($scope.message.phone));
        };

        $scope.isSubmitted = function() {
            return $scope.submit;
        };
        $scope.clicked = function() {
            $scope.submit = true;
        };
    }

    // Module
    angular
        .module('Contacts', ['ngRoute'])
        .config(Config)
        .service('SendMessageService', Service)
        .controller('Contacts', Ctrl);
})();
