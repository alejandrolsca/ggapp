module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.shippingListReleaseInvoice',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('shippingListReleaseInvoice', {
            url:'/shippinglist/releaseinvoice/:sl_id',
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
            controller : 'shippingListReleaseInvoiceCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'warehouse'
                ]
            }    
        });
    }])

    .factory('shippingListReleaseInvoiceFac',require('./shippingList.view.fac'))

    .controller('shippingListReleaseInvoiceCtrl',require('./shippingList.view.ctrl'))

})(angular);