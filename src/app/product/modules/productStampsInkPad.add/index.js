module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productStampsInkPad.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productStampsInkPadAdd', {
            url:'/product/add/stamps/ink_pad/:cl_id',
            template: require('./productStampsInkPad.add.view.html'),
            controller : 'productStampsInkPadAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productStampsInkPadAddFac',require('./productStampsInkPad.add.fac'))

    .controller('productStampsInkPadAddCtrl',require('./productStampsInkPad.add.ctrl'))

})(angular);