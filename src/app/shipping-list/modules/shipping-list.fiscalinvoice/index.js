module.exports = (function (angular) {
    'use strict';

    return angular.module('app.shippingListFiscalInvoice', [])

        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('shippingListFiscalInvoice', {
                    url: '/shippinglist/fiscalinvoice/:sl_id',
                    template: require('./shippingList.fiscalinvoice.view.html'),
                    params: {
                        // avoids sending parameters through URL
                        cl_id: null,
                        zo_id: null,
                        wo_id: null,
                        sl_cancelled: null,
                        sl_createdby: null,
                        sl_date: null
                    },
                    controller: 'shippingListFiscalInvoiceCtrl',
                    data: {
                        requiresLogin: true,
                        roles: [
                            'admin',
                            'warehouse'
                        ]
                    }
                });
            }])

        .factory('shippingListFiscalInvoiceFac', require('./shippingList.fiscalinvoice.fac'))

        .controller('shippingListFiscalInvoiceCtrl', require('./shippingList.fiscalinvoice.ctrl'))

})(angular);