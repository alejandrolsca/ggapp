module.exports = (function(angular){
    'use strict';
    
    return function ($scope, productOffsetGeneralAddFac, $window, $location, i18nFilter, $interval, $stateParams) {
        $scope.fmData = {};
        $scope.fmData.pr_process = 'offset';
        $scope.fmData.pr_type = 'general';
        $scope.fmData.cl_id = $stateParams.cl_id;

        $scope.onSubmit = function() {

            productOffsetGeneralAddFac.add($scope.fmData).then(function(promise){
                if(promise.data == "1") {
                    $location.path('/product');
                } else {
                    $scope.updateFail = true;
                }
                //console.log(JSON.stringify(promise.data));
            });
            //console.log('form submitted:', $scope.formData);
        };
        
        $scope.pr_finalsizemeasureoptions = i18nFilter("productOffsetGeneral-add.fields.pr_finalsizemeasureoptions");
        $scope.pr_inkfrontoptions = i18nFilter("productOffsetGeneral-add.fields.pr_inkfrontoptions");
        $scope.pr_inkbackoptions = i18nFilter("productOffsetGeneral-add.fields.pr_inkbackoptions");
        $scope.pr_varnishoptions = i18nFilter("productOffsetGeneral-add.fields.pr_varnishoptions");
        $scope.pr_varnishuvhoptions = i18nFilter("productOffsetGeneral-add.fields.pr_varnishuvhoptions");
        $scope.pr_varnisfinishedoptions = i18nFilter("productOffsetGeneral-add.fields.pr_varnisfinishedoptions");
        $scope.pr_laminateoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminateoptions");
        $scope.pr_laminatefinishedoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminatefinishedoptions");
        $scope.pr_laminatecaliberoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminatecaliberoptions");
        $scope.pr_laminatesidesoptions = i18nFilter("productOffsetGeneral-add.fields.pr_laminatesidesoptions");
        $scope.pr_foliooptions = i18nFilter("productOffsetGeneral-add.fields.pr_foliooptions");
        $scope.pr_precutoptions = i18nFilter("productOffsetGeneral-add.fields.pr_precutoptions");
        $scope.pr_foldoptions = i18nFilter("productOffsetGeneral-add.fields.pr_foldoptions");
        $scope.pr_diecuttingoptions = i18nFilter("productOffsetGeneral-add.fields.pr_diecuttingoptions");
        $scope.pr_reinforcementoptions = i18nFilter("productOffsetGeneral-add.fields.pr_reinforcementoptions");
        $scope.pr_wireoptions = i18nFilter("productOffsetGeneral-add.fields.pr_wireoptions");
        $scope.pr_blocksoptions = i18nFilter("productOffsetGeneral-add.fields.pr_blocksoptions");
        $scope.pr_statusoptions = i18nFilter("productOffsetGeneral-add.fields.pr_statusoptions");
        
        // create front ink fields
        $scope.$watch('fmData.pr_inkfront', function(newValue, oldValue) {
            if($scope.fmData.pr_inkfront != undefined) {
                $scope.frontInks = new Array($scope.fmData.pr_inkfront);
                for (var i=0; i<$scope.frontInks.length; i++) {
                    $scope.fmData['pr_inkfront'+(i+1)] = undefined;
                }
            }
        });
        
        // create back ink fields
        $scope.$watch('fmData.pr_inkback', function(newValue, oldValue) {
            if($scope.fmData.pr_inkback != undefined) {
                $scope.backInks = new Array($scope.fmData.pr_inkback);
                for (var i=0; i<$scope.backInks.length; i++) {
                    $scope.fmData['pr_inkback'+(i+1)] = undefined;
                }
            }
        });

        $scope.$on('$viewContentLoaded', function () {
            // this code is executed after the view is loaded
            
            productOffsetGeneralAddFac.getClient().then(function(promise){
                $scope.loading = false;
                if(angular.isObject(promise.data)) {
                    $scope.client = promise.data;
                }
                console.log(JSON.stringify(promise.data));
            });
    
         });
    };
    
})(angular);