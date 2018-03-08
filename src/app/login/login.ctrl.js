module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'authService',
        function ($scope, authService) {
            $scope.gglogo = require('../../static/img/gg-logo.png');
            $scope.authService = authService;
        }]

})(angular);