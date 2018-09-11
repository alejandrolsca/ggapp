module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDirectSaleGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDirectSaleGeneralAdd', {
            url:'/product/add/direct_sale/general/:cl_id',
            template: require('./productDirectSaleGeneral.add.view.html'),
            controller : 'productDirectSaleGeneralAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productDirectSaleGeneralAddFac',require('./productDirectSaleGeneral.add.fac'))

    .controller('productDirectSaleGeneralAddCtrl',require('./productDirectSaleGeneral.add.ctrl'))

})(angular);