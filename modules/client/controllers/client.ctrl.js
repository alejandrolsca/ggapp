'use strict';

module.exports = function ($scope, clientFac, $window, i18nFilter, $parse) {
    
    $scope.fields = Object.keys(i18nFilter("CLIENT.FIELDS"));
    
    $scope.showEdit = true;
    $scope.showDuplicate = false;
    
    $scope.edit = function (id) {
        if (angular.isNumber(id)) {
                //Embed the id to the link
                var link = "#/client/update/" + id;
                //Open the link
                window.location = link;
        }
    }
    
    $scope.duplicate = function (id) {
        if (angular.isNumber(id)) {
                var link = "#/client/duplicate/" + id;
                //Open the link
                window.location = link;
        }
    }
    
    $scope.$on('$viewContentLoaded', function () {
        // this code is executed after the view is loaded
        $scope.loading = true;
        clientFac.data().then(function(promise){
            $scope.loading = false;
            if(angular.isArray(promise.data)) {
                $scope.data = promise.data;
            }
            console.log(angular.fromJson(promise.data));
        });
     });
};