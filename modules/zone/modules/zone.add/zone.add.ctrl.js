module.exports = (function(angular){
    'use strict';
    
    return function ($scope, zoneAddFac, $window, $location, i18nFilter, $interval, $stateParams) {
        $scope.fmData = {};
        $scope.fmData.cl_id = $stateParams.cl_id;

        $scope.onSubmit = function() {

            zoneAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/zone');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };

        $scope.getStates = function() {
            $scope.zo_stateoptions = [];
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneAddFac.getStates($scope.fmData.zo_country).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_stateoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        }

        $scope.getCityCounty = function() {
            $scope.zo_cityoptions = [];
            $scope.zo_countyoptions = [];
            $interval(function(){
                zoneAddFac.getStates($scope.fmData.zo_state).then(function(promise){
                    if(angular.isArray(promise.data.geonames)) {
                        $scope.zo_cityoptions = promise.data.geonames;
                        $scope.zo_countyoptions = promise.data.geonames;
                    } else {
                        //$scope.updateFail = true;
                    }
                    //console.log(JSON.stringify(promise.data));
                });
            },0,1);
        };
        
        $scope.zo_statusoptions = i18nFilter("zone.fields.zo_statusoptions");

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            zoneAddFac.getClient().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(promise.data)) {
                    $scope.client = promise.data;
                }
                console.log(JSON.stringify(promise.data));
            });
            
            zoneAddFac.getCountries().then(function(promise){
                if(angular.isArray(promise.data.geonames)) {
                    $scope.zo_countryoptions = promise.data.geonames;
                } else {
                    //$scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data.geonames));
            });

         });
    };
    
})(angular);