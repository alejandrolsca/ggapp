module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDigitalGeneral.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDigitalGeneralUpdate', {
            url:'/product/update/digital/general/:cl_id/:pr_id',
            template: require('./productDigitalGeneral.update.view.html'),
            controller : 'productDigitalGeneralUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productDigitalGeneralUpdateFac',require('./productDigitalGeneral.update.fac'))

    .controller('productDigitalGeneralUpdateCtrl',require('./productDigitalGeneral.update.ctrl'))

})(angular);