module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productStampsInk.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productStampsInkUpdate', {
            url:'/product/update/stamps/ink/:cl_id/:pr_id',
            template: require('./productStampsInk.update.view.html'),
            controller : 'productStampsInkUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productStampsInkUpdateFac',require('./productStampsInk.update.fac'))

    .controller('productStampsInkUpdateCtrl',require('./productStampsInk.update.ctrl'))

})(angular);