module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.exportationInvoice',[
        require('./modules/exportation-invoice.add').name,
        require('./modules/exportation-invoice.view').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('exportationInvoice', {
            url:'/exportationinvoice/:cl_id',
            template: require('./exportationInvoice.view.html'),
            controller : 'exportationInvoiceController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('exportationInvoiceFactory',require('./exportationInvoice.fac'))

    .controller('exportationInvoiceController',require('./exportationInvoice.ctrl'))

})(angular);