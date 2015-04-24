module.exports = (function(angular){
    'use strict';
    
    return function ($scope, clientAddFac, $window, $location, i18nFilter, $interval) {
        $scope.fmData = {};

        $scope.onSubmit = function() {

            clientAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/client');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };

        $scope.getStates = function() {
            $scope.cl_stateoptions = [];
            $scope.cl_cityoptions = [];
            $scope.cl_countyoptions = [];
            $interval(function(){
                clientAddFac.getStates($scope.fmData.cl_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.cl_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.cl_cityoptions = [];
            $scope.cl_countyoptions = [];
            $interval(function(){
                clientAddFac.getStates($scope.fmData.cl_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.cl_cityoptions = promise.data.geonames;
                        $scope.cl_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        };
        
        $scope.cl_statusoptions = i18nFilter("client.fields.cl_statusoptions");

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            clientAddFac.getCountries().then(function(promise){
                if(angular.isArray(promise.data.geonames)) {
                    $scope.cl_countryoptions = promise.data.geonames;
                } else {
                    //$scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data.geonames));
            });

         });
    };
    
})(angular);