module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productStampsInkPad.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productStampsInkPadUpdate', {
            url:'/product/update/stamps/ink_pad/:cl_id/:pr_id',
            template: require('./productStampsInkPad.update.view.html'),
            controller : 'productStampsInkPadUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productStampsInkPadUpdateFac',require('./productStampsInkPad.update.fac'))

    .controller('productStampsInkPadUpdateCtrl',require('./productStampsInkPad.update.ctrl'))

})(angular);