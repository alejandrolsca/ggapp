module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDirectSaleGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDirectSaleGeneralUpdate', {
            url:'/product/update/direct_sale/general/:cl_id/:pr_id',
            template: require('./productDirectSaleGeneral.update.view.html'),
            controller : 'productDirectSaleGeneralUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productDirectSaleGeneralUpdateFac',require('./productDirectSaleGeneral.update.fac'))

    .controller('productDirectSaleGeneralUpdateCtrl',require('./productDirectSaleGeneral.update.ctrl'))

})(angular);