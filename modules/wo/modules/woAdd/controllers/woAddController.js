'use strict';

module.exports = function ($scope, woAddFactory, $window) {
    
    $scope.$on('$viewContentLoaded', function () {
        // this code is executed after the view is loaded
        $scope.loading = true;
        woAddFactory.addData().then(function(promise){
            $scope.loading = false;
            if(angular.isArray(promise.data)) {
               
            }
            console.log(JSON.stringify(promise.data));
        });
     });
};