module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDigitalPaginated.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDigitalPaginatedUpdate', {
            url:'/product/update/digital/paginated/:cl_id/:pr_id',
            template: require('./productDigitalPaginated.update.view.html'),
            controller : 'productDigitalPaginatedUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productDigitalPaginatedUpdateFac',require('./productDigitalPaginated.update.fac'))

    .controller('productDigitalPaginatedUpdateCtrl',require('./productDigitalPaginated.update.ctrl'))

})(angular);