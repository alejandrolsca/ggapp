module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productStampsGeneral.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productStampsGeneralAdd', {
            url:'/product/add/stamps/general/:cl_id',
            template: require('./productStampsGeneral.add.view.html'),
            controller : 'productStampsGeneralAddCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productStampsGeneralAddFac',require('./productStampsGeneral.add.fac'))

    .controller('productStampsGeneralAddCtrl',require('./productStampsGeneral.add.ctrl'))

})(angular);