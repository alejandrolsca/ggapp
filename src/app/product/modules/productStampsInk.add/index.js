module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productStampsInk.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productStampsInkAdd', {
            url:'/product/add/stamps/ink/:cl_id',
            template: require('./productStampsInk.add.view.html'),
            controller : 'productStampsInkAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productStampsInkAddFac',require('./productStampsInk.add.fac'))

    .controller('productStampsInkAddCtrl',require('./productStampsInk.add.ctrl'))

})(angular);