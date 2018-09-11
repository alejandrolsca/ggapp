module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDiecuttingGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDiecuttingGeneralAdd', {
            url:'/product/add/diecutting/general/:cl_id',
            template: require('./productDiecuttingGeneral.add.view.html'),
            controller : 'productDiecuttingGeneralAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productDiecuttingGeneralAddFac',require('./productDiecuttingGeneral.add.fac'))

    .controller('productDiecuttingGeneralAddCtrl',require('./productDiecuttingGeneral.add.ctrl'))

})(angular);