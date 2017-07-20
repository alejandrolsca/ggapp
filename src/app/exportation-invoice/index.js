module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.exportationInvoice',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('exportationInvoice', {
            url:'/einvoice/:cl_id',
            template: require('./exportation-invoice.view.html'),
            controller : 'exportationInvoiceCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('exportationInvoiceFac',require('./exportation-invoice.fac'))

    .controller('exportationInvoiceCtrl',require('./exportation-invoice.ctrl'))

})(angular);