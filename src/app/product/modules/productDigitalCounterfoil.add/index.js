module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.productDigitalCounterfoil.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('productDigitalCounterfoilAdd', {
            url:'/product/add/digital/counterfoil/:cl_id',
            template: require('./productDigitalCounterfoil.add.view.html'),
            controller : 'productDigitalCounterfoilAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('productDigitalCounterfoilAddFac',require('./productDigitalCounterfoil.add.fac'))

    .controller('productDigitalCounterfoilAddCtrl',require('./productDigitalCounterfoil.add.ctrl'))

})(angular);