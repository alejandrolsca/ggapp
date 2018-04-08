module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.shippingListView',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('shippingListView', {
            url:'/shippinglist/view/:sl_id',
            template: require('./shippingList.view.view.html'),
            params: {
                // avoids sending parameters through URL
                cl_id: null,
                zo_id: null,
                wo_id: null,
                sl_cancelled: null,
                sl_createdby: null,
                sl_date: null 
            },
            controller : 'shippingListViewCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('shippingListViewFac',require('./shippingList.view.fac'))

    .controller('shippingListViewCtrl',require('./shippingList.view.ctrl'))

})(angular);