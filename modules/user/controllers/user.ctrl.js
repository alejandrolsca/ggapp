'use strict';

module.exports = function ($scope, userFac, $window, i18nFilter, $parse) {
    
    $scope.fields = Object.keys(i18nFilter("USER.FIELDS"));
    
    console.log(JSON.stringify($scope.fields));
    
    $scope.showEdit = true;
    $scope.showDuplicate = false;
    
    $scope.edit = function (id) {
        if (angular.isNumber(id)) {
                //Embed the id to the link
                var link = "#/user/update/" + id;
                //Open the link
                window.location = link;
        }
    }
    
    $scope.duplicate = function (id) {
        if (angular.isNumber(id)) {
                var link = "#/user/duplicate/" + id;
                //Open the link
                window.location = link;
        }
    }
    
    $scope.$on('$viewContentLoaded', function () {
        // this code is executed after the view is loaded
        $scope.loading = true;
        userFac.data().then(function(promise){
            $scope.loading = false;
            if(angular.isArray(promise.data)) {
                $scope.data = promise.data;
            }
            console.log(angular.fromJson(promise.data));
        });
     });
};