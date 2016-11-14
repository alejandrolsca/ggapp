module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woDuplicateFactory', '$stateParams', 'i18nFilter', '$filter','$location',
        function ($scope, woDuplicateFactory, $stateParams, i18nFilter, $filter, $location) {

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");
            
            $scope.onSubmit = function () {

                woDuplicateFactory.add($scope.fmData).then(function (promise) {
                    if (promise.data.rowCount === 1) {
                        $location.path('/wo/' + $stateParams.cl_id);
                    } else {
                        $scope.updateFail = true;
                    }
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                var client = undefined;
                woDuplicateFactory.getData().then(function(promise){
                    $scope.loading = false;
                    if(angular.isArray(promise.data) && promise.data.length === 1) {
                            $scope.fmData = promise.data[0].wo_jsonb;
                            $scope.fmData.wo_previousid = promise.data[0].wo_id;
                            $scope.fmData.wo_previousdate = promise.data[0].wo_date.substring(0, 10);
                    }
                });
                woDuplicateFactory.getClient().then(function (promise) {
                    if (angular.isArray(promise.data)) {
                        client = promise.data[0];
                    }
                }).then(function () {
                    woDuplicateFactory.getZone().then(function (promise) {
                        $scope.zo_idoptions = [];
                        $scope.zo_idoptions.push({ "label": client.cl_jsonb.cl_tin, "value": "0" });
                        if (angular.isArray(promise.data)) {
                            var rows = promise.data;
                            angular.forEach(rows, function (value, key) {
                                this.push({ "label": rows[key]['zo_jsonb']['zo_name'], "value": rows[key]['zo_id'] });
                            }, $scope.zo_idoptions);
                        }
                    });
                })
                woDuplicateFactory.getMachine().then(function (promise) {
                    $scope.ma_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                        }, $scope.ma_idoptions);
                    }
                });
                woDuplicateFactory.getProduct().then(function (promise) {
                    $scope.pr_idoptions = [];
                    var rows = [];
                    if (angular.isArray(promise.data)) {
                        rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['pr_id'] + '_' + rows[key]['pr_jsonb']['pr_name'] + '_' + rows[key]['pr_jsonb']['pr_code'], "value": rows[key]['pr_id'] });
                        }, $scope.pr_idoptions);
                    }
                    
                    $scope.$watch(
                        "fmData.pr_id",
                        function prChange(newValue, oldValue) {
                            if (newValue !== undefined) {
                                var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                                if (product.length !== 1) {
                                    $scope.prinfo = false;
                                    return;
                                } else {
                                    $scope.prinfo = true;
                                    $scope.product = product[0];
                                    $scope.folio = (product[0]['pr_jsonb']['pr_folio'] === 'yes') ? true : false;
                                }
                            }
                        }
                    );
                });
                $scope.loading = false;
            });
        }];

})(angular);