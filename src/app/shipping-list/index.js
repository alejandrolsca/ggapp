module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.shippingList',[
        require('./modules/shipping-list.add').name,
        require('./modules/shipping-list.view').name,
        require('./modules/shipping-list.invoice').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('shippingList', {
            url:'/shippinglist/:cl_id',
            template: require('./shippingList.view.html'),
            controller : 'shippingListController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('shippingListFactory',require('./shippingList.fac'))

    .controller('shippingListController',require('./shippingList.ctrl'))

})(angular);