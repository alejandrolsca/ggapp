module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productStampsGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productStampsGeneralUpdate', {
            url:'/product/update/stamps/general/:cl_id/:pr_id',
            template: require('./productStampsGeneral.update.view.html'),
            controller : 'productStampsGeneralUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productStampsGeneralUpdateFac',require('./productStampsGeneral.update.fac'))

    .controller('productStampsGeneralUpdateCtrl',require('./productStampsGeneral.update.ctrl'))

})(angular);