module.exports = (function (angular) {
    'use strict';

    return ['$scope','$stateParams', function ($scope, $stateParams) {
        $scope.toState = $stateParams.toState
    }];

})(angular);