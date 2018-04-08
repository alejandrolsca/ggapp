module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.exportationInvoiceView',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('exportationInvoiceView', {
            url:'/exportationinvoice/view/:ei_id',
            template: require('./exportationInvoice.view.view.html'),
            controller : 'exportationInvoiceViewCtrl',
            params: {
                // avoids sending parameters through URL
                cl_id: null,
                zo_id: null,
                wo_id: null,
                sl_cancelled: null,
                sl_createdby: null,
                sl_date: null 
            },
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('exportationInvoiceViewFac',require('./exportationInvoice.view.fac'))

    .controller('exportationInvoiceViewCtrl',require('./exportationInvoice.view.ctrl'))

})(angular);