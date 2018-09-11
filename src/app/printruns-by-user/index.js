module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.printrunsByUser',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('printrunsByUser', {
            url:'/printrunsbyuser',
            template: require('./printruns-by-user.view.html'),
            controller : 'printrunsByUserCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin'
                ]
            }    
        });
    }])

    .factory('printrunsByUserFac',require('./printruns-by-user.fac'))

    .controller('printrunsByUserCtrl',require('./printruns-by-user.ctrl'))
    
})(angular);
