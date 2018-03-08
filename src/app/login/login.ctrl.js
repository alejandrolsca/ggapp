module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'authService',
        function ($scope, authService) {
            authService.login();
        }]

})(angular);