module.exports = (function(angular){
    'use strict';
    
    return ['$scope', 'machineAddFac', '$location', 'i18nFilter',
    function ($scope, machineAddFac, $location, i18nFilter) {
        $scope.fmData = {};

        $scope.onSubmit = function() {

            machineAddFac.add($scope.fmData).then(function(promise){
                if (promise.data.rowCount === 1) {
                        $location.path('/machine');
                    } else {
                        $scope.updateFail = true;
                    }
            });
        };

        $scope.ma_sizemeasureoptions = i18nFilter("machine.fields.ma_sizemeasureoptions");
        $scope.ma_fullcoloroptions = i18nFilter("machine.fields.ma_fullcoloroptions");
        $scope.ma_printbgoptions = i18nFilter("machine.fields.ma_printbgoptions");
        $scope.ma_processoptions = i18nFilter("machine.fields.ma_processoptions");
        $scope.ma_statusoptions = i18nFilter("machine.fields.ma_statusoptions");

        const printRunProcesses = ['offset','digital','flexo','plotter']

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            $scope.$watch('fmData.ma_process', function (newValue) {
                $scope.isPrintRunProcess = printRunProcesses.includes(newValue)
                $scope.printRunProcess = newValue
            })

        });
    }];
    
})(angular);