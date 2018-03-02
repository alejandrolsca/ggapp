module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'zoneAddFac', '$location', 'i18nFilter', '$interval', '$stateParams',
        function ($scope, zoneAddFac, $location, i18nFilter, $interval, $stateParams) {
            $scope.fmData = {};
            $scope.fmData.cl_id = +$stateParams.cl_id;

            $scope.onSubmit = function () {

                zoneAddFac.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/zone/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.getStates = function () {
                $scope.zo_stateoptions = [];
                $scope.zo_cityoptions = [];
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneAddFac.getChilds($scope.fmData.zo_country).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.zo_stateoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCity = function () {
                $scope.zo_cityoptions = [];
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneAddFac.getChilds($scope.fmData.zo_state).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.zo_cityoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.getCounty = function () {
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneAddFac.getChilds($scope.fmData.zo_city).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.zo_countyoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            };

            $scope.zo_statusoptions = i18nFilter("zone.fields.zo_statusoptions");
            $scope.zo_typeoptions = i18nFilter("zone.fields.zo_typeoptions");

            $scope.$on('$viewContentLoaded', async function () {
                // this code is executed after the view is loaded

                const { data: clients } = await zoneAddFac.getClient()
                const [client] = clients
                $scope.client = client.cl_corporatename

                const { data: countries} = await zoneAddFac.getCountries()
                $scope.zo_countryoptions = countries

                $scope.loading = false;

            });
        }];

})(angular);