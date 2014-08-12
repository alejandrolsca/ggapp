'use strict';

module.exports = function ($scope, userUpdateFac, $window, $location, i18nFilter) {
        
    $scope.onSubmit = function() {
    
        userUpdateFac.update($scope.fmData).then(function(promise){
            if(promise.data == "1") {
                $location.path('/user');
            } else {
                $scope.updateFail = true;
            }
            //console.log(JSON.stringify(promise.data));
        });
        //console.log('form submitted:', $scope.formData);
    };
    
    $scope.$on('$viewContentLoaded', function () {
        // this code is executed after the view is loaded
        
        $scope.loading = true;
        userUpdateFac.data().then(function(promise){
            $scope.loading = false;
            if(angular.isObject(angular.fromJson(promise.data))) {
                    $scope.fmData = angular.fromJson(promise.data);
            }
            console.log(promise.data);
        });
        
        
        
     });
};