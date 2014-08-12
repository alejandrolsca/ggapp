'use strict';

module.exports = function ($rootScope, $scope, homeFac, $window) {
    console.log($rootScope.user);
    $scope.user = $rootScope.user;
    $scope.$on('$viewContentLoaded', function () {
        // this code is executed after the view is loaded
    });
};