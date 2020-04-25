module.exports = (function (angular) {
    'use strict';

    return ['$scope', 'woViewFactory', '$stateParams', 'i18nFilter', '$filter','$location', 'authService',
        function ($scope, woViewFactory, $stateParams, i18nFilter, $filter, $location, authService) {
            
            const camelCase = (...args) => {
                const camelCase = args.map(function (value, index) {
                    if (index === 0) {
                        return value.toLowerCase()
                    }
                    return value.charAt(0).toUpperCase() + value.substr(1);
                });
                return camelCase.join('')
            }

            $scope.displayPrice = authService.userHasRole(['admin','warehouse','sales'])

            $scope.wo_qtymeasureoptions = i18nFilter("wo-add.fields.wo_qtymeasureoptions");
            $scope.wo_foliosperformatoptions = i18nFilter("wo-add.fields.wo_foliosperformatoptions");
            $scope.wo_currencyoptions = i18nFilter("wo-add.fields.wo_currencyoptions");
            $scope.wo_emailoptions = i18nFilter("wo-add.fields.wo_emailoptions");

            $scope.$on('$viewContentLoaded', function () {
                // this code is executed after the view is loaded
                $scope.loading = true;
                woViewFactory.getData().then(function(promise){
                    $scope.loading = false;
                    if(angular.isArray(promise.data) && promise.data.length === 1) {
                            const [wo] = promise.data
                            const {wo_jsonb: {wo_type}, wo_jsonb: fmData} = wo
                            $scope.fmData = fmData;
                            $scope.wo_type = wo_type;
                            $scope.wo_id = wo.wo_id;
                            $scope.wo_date = wo.wo_date;
                            $scope.zoneViewUrl = `/zone/view/${$scope.fmData.cl_id}/${$scope.fmData.zo_id}`;
                            const { username } = authService.profile()
                            $scope.fmData.wo_updatedby = username;
                            
                    }
                    woViewFactory.getProduct($scope.fmData.pr_id).then(function (promise) {
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
                                if (newValue !== undefined) {
                                    var product = $filter('filter')(rows, { "pr_id": newValue }, true);
                                    if (product.length !== 1) {
                                        $scope.prinfo = false;
                                        return;
                                    } else {
                                        $scope.prinfo = true;
                                        $scope.product = product[0];
                                        $scope.productUpdateUrl = `/product/update/${$scope.product['pr_jsonb']['pr_process']}/${$scope.product['pr_jsonb']['pr_type']}/${$scope.product['pr_jsonb']['cl_id']}/${$scope.product['pr_id']}`
                                        $scope.folio = (product[0]['pr_jsonb']['pr_folio'] === 'yes') ? true : false;
                                        var pr_type = product[0]['pr_jsonb']['pr_type'] 
                                        $scope.components = (pr_type === 'paginated' || pr_type === 'counterfoil') ? true : false;
                                        $scope.componentsArray = new Array(product[0]['pr_jsonb']['pr_components'])
                                    }
                                }
                            }
                        );
                    })
                });
                woViewFactory.getZone().then(function (promise) {
                    $scope.zo_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['zo_jsonb']['zo_zone'], "value": rows[key]['zo_id'] });
                        }, $scope.zo_idoptions);
                    }
                });
                woViewFactory.getMachine().then(function (promise) {
                    $scope.ma_idoptions = [];
                    if (angular.isArray(promise.data)) {
                        var rows = promise.data;
                        angular.forEach(rows, function (value, key) {
                            this.push({ "label": rows[key]['ma_name'], "value": rows[key]['ma_id'] });
                        }, $scope.ma_idoptions);
                    }
                });
                $scope.loading = false;
            });
        }];

})(angular);