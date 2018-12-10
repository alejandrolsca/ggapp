module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'zoneViewFac', '$location', 'i18nFilter', '$interval', '$stateParams',
        function ($scope, zoneViewFac, $location, i18nFilter, $interval, $stateParams) {

            $scope.getStates = function () {
                $scope.zo_stateoptions = [];
                $scope.zo_cityoptions = [];
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneViewFac.getChilds($scope.fmData.zo_country).then(function (promise) {
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
                    zoneViewFac.getChilds($scope.fmData.zo_state).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.zo_cityoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.getCounty = function () {
                $scope.zo_countyoptions = [];
                $interval(function () {
                    zoneViewFac.getChilds($scope.fmData.zo_city).then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.zo_countyoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    });
                }, 0, 1);
            }

            $scope.zo_statusoptions = i18nFilter("zone.fields.zo_statusoptions");
            $scope.zo_typeoptions = i18nFilter("zone.fields.zo_typeoptions");

            $scope.$on('$viewContentLoaded', async function () {
                // this code is executed after the view is loaded
                $scope.loading = true;

                const { data: clients } = await zoneViewFac.getClient()
                const [client] = clients
                $scope.client = client.cl_corporatename

                zoneViewFac.data().then(function (promise) {
                    $scope.loading = false;
                    if (angular.isArray(promise.data) && promise.data.length === 1) {
                        $scope.fmData = promise.data[0].zo_jsonb;
                    }
                }).then(function () {
                    zoneViewFac.getCountries().then(function (promise) {
                        if (angular.isArray(promise.data)) {
                            $scope.zo_countryoptions = promise.data;
                        } else {
                            //$scope.updateFail = true;
                        }
                    }).then(function () {
                        zoneViewFac.getChilds($scope.fmData.zo_country).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.zo_stateoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        zoneViewFac.getChilds($scope.fmData.zo_state).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.zo_cityoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    }).then(function () {
                        zoneViewFac.getChilds($scope.fmData.zo_city).then(function (promise) {
                            if (angular.isArray(promise.data)) {
                                $scope.zo_countyoptions = promise.data;
                            } else {
                                //$scope.updateFail = true;
                            }
                        })
                    });
                });

            });
        }];

})(angular);