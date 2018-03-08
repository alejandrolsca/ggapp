module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.shippingList',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('shippingList', {
            url:'/shipping-list/:cl_id',
            template: require('./shipping-list.view.html'),
            controller : 'shippingListCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('shippingListFac',require('./shipping-list.fac'))

    .controller('shippingListCtrl',require('./shipping-list.ctrl'))

})(angular);