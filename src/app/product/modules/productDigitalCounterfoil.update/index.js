module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDigitalCounterfoil.update',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDigitalCounterfoilUpdate', {
            url:'/product/update/digital/counterfoil/:cl_id/:pr_id',
            template: require('./productDigitalCounterfoil.update.view.html'),
            controller : 'productDigitalCounterfoilUpdateCtrl',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('productDigitalCounterfoilUpdateFac',require('./productDigitalCounterfoil.update.fac'))

    .controller('productDigitalCounterfoilUpdateCtrl',require('./productDigitalCounterfoil.update.ctrl'))

})(angular);