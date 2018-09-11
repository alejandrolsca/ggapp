module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.exportationInvoiceAdd',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('exportationInvoiceAdd', {
            url:'/exportationinvoice/add/:cl_id',
            template: require('./exportationInvoice.add.view.html'),
            controller : 'exportationInvoiceAddCtrl',
            params: {
                wo_id: null // avoids sending parameters through URL
            },
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'warehouse'
                ]
            }    
        });
    }])

    .factory('exportationInvoiceAddFac',require('./exportationInvoice.add.fac'))

    .controller('exportationInvoiceAddCtrl',require('./exportationInvoice.add.ctrl'))

})(angular);