module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'machineUpdateFac', '$location', 'i18nFilter',
        function ($scope, machineUpdateFac, $location, i18nFilter) {

            $scope.onSubmit = function () {

                machineUpdateFac.update($scope.fmData).then(function (promise) {
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
                $scope.loading = true;
                machineUpdateFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].ma_jsonb;
                    }
                    $scope.$watch('fmData.ma_process', function (newValue) {
                        $scope.isPrintRunProcess = printRunProcesses.includes(newValue)
                        $scope.printRunProcess = newValue
                    })
                });
            });
        }];

})(angular);