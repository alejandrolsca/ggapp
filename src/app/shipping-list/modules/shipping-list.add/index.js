module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.shippingListAdd',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('shippingListAdd', {
            url:'/shippinglist/add/:cl_id',
            template: require('./shippingList.add.view.html'),
            params: {
                wo_id: null // avoids sending parameters through URL
            },
            controller : 'shippingListAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('shippingListAddFac',require('./shippingList.add.fac'))

    .controller('shippingListAddCtrl',require('./shippingList.add.ctrl'))

})(angular);