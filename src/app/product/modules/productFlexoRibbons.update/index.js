module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productFlexoRibbons.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productFlexoRibbonsUpdate', {
            url:'/product/update/flexo/ribbons/:cl_id/:pr_id',
            template: require('./productFlexoRibbons.update.view.html'),
            controller : 'productFlexoRibbonsUpdateCtrl',
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

    .factory('productFlexoRibbonsUpdateFac',require('./productFlexoRibbons.update.fac'))

    .controller('productFlexoRibbonsUpdateCtrl',require('./productFlexoRibbons.update.ctrl'))

})(angular);