module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDigitalPaginated.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDigitalPaginatedAdd', {
            url:'/product/add/digital/paginated/:cl_id',
            template: require('./productDigitalPaginated.add.view.html'),
            controller : 'productDigitalPaginatedAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productDigitalPaginatedAddFac',require('./productDigitalPaginated.add.fac'))

    .controller('productDigitalPaginatedAddCtrl',require('./productDigitalPaginated.add.ctrl'))

})(angular);