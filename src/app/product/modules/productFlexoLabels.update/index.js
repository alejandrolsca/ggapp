module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productFlexoLabels.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productFlexoLabelsUpdate', {
            url:'/product/update/flexo/labels/:cl_id/:pr_id',
            template: require('./productFlexoLabels.update.view.html'),
            controller : 'productFlexoLabelsUpdateCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'finishing',
                    'packaging',
                    'production',
                    'quality_assurance',
                    'sales',
                    'warehouse'
                ]
            }    
        });
    }])

    .factory('productFlexoLabelsUpdateFac',require('./productFlexoLabels.update.fac'))

    .controller('productFlexoLabelsUpdateCtrl',require('./productFlexoLabels.update.ctrl'))

})(angular);