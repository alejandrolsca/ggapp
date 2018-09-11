module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productSerigraphyFlexibles.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productSerigraphyFlexiblesUpdate', {
            url:'/product/update/serigraphy/flexibles/:cl_id/:pr_id',
            template: require('./productSerigraphyFlexibles.update.view.html'),
            controller : 'productSerigraphyFlexiblesUpdateCtrl',
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

    .factory('productSerigraphyFlexiblesUpdateFac',require('./productSerigraphyFlexibles.update.fac'))

    .controller('productSerigraphyFlexiblesUpdateCtrl',require('./productSerigraphyFlexibles.update.ctrl'))

})(angular);