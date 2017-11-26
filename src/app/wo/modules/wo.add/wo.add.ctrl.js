module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woAddFactory', '$stateParams', 'i18nFilter', '$filter', '$location',
        function ($scope, woAddFactory, $stateParams, i18nFilter, $filter, $location) {
            $scope.fmData = {};
            $scope.fmData.wo_type = "N"; //N-new,R-rep,C-change
            $scope.fmData.wo_status = 0; //0-Active
            $scope.fmData.cl_id = +$stateParams.cl_id;
            $scope.fmData.pr_id = +$stateParams.pr_id;

            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");

            $scope.onSubmit = function () {

                woAddFactory.add($scope.fmData).then(function (promise) {
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
                woAddFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_zone'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                });

                woAddFactory.getProduct().then(function (promise) {
                    $scope.pr_idoptions = [];
                    var rows = [];
                    if (angular.isArray(promise.data)) {                    
                        rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['pr_jsonb']['pr_code'] + ' - ' + rows[key]['pr_jsonb']['pr_name'], "value": rows[key]['pr_id'] });
                        }, $scope.pr_idoptions);
                    }

                    $scope.$watch(
                        "fmData.pr_id",
                        function prChange(newValue, oldValue) {
                            $scope.fmData.wo_qty = undefined;
                            $scope.fmData.wo_boxqty = undefined;
                            $scope.fmData.wo_materialqty = undefined;
                            $scope.fmData.wo_packageqty = undefined;
                            $scope.fmData.wo_foliosperformat = undefined;
                            $scope.fmData.wo_foliosseries = undefined;
                            $scope.fmData.wo_foliosfrom = undefined;
                            $scope.fmData.wo_foliosto = undefined;
                            if (newValue !== undefined) {
                                var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                                if (product.length !== 1) {
                                    $scope.prinfo = false;
                                    return;
                                } else {
                                    $scope.prinfo = true;
                                    $scope.product = product[0];
                                    $scope.folio = (product[0]['pr_jsonb']['pr_folio'] === 'yes') ? true : false;
                                    var pr_type = product[0]['pr_jsonb']['pr_type'] 
                                    $scope.components = (pr_type === 'paginated' || pr_type === 'counterfoil') ? true : false;
                                    $scope.componentsArray = new Array(product[0]['pr_jsonb']['pr_components'])
                                    woAddFactory.getMachine(product[0]['pr_jsonb']['pr_process']).then(function (promise) {
                                        $scope.ma_idoptions = [];
                                        if (angular.isArray(promise.data)) {
                                            var rows = promise.data;
                                            angular.forEach(rows, function (value, key) {
                                                this.push({ "label": rows[key]['ma_jsonb']['ma_name'], "value": rows[key]['ma_id'] });
                                            }, $scope.ma_idoptions);
                                        }
                                    });
                                }
                            }
                        }
                    );
                });
                $scope.loading = false;
            });
        }];

})(angular);