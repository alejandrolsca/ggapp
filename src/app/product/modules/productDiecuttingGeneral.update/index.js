module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDiecuttingGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDiecuttingGeneralUpdate', {
            url:'/product/update/diecutting/general/:cl_id/:pr_id',
            template: require('./productDiecuttingGeneral.update.view.html'),
            controller : 'productDiecuttingGeneralUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productDiecuttingGeneralUpdateFac',require('./productDiecuttingGeneral.update.fac'))

    .controller('productDiecuttingGeneralUpdateCtrl',require('./productDiecuttingGeneral.update.ctrl'))

})(angular);