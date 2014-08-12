'use strict';

module.exports = function () {
    return {
        restrict: 'E',
        scope:{
            data: '=data'
        },
        template: '<ul id="mainMenu">'+
                    '<li ng-repeat="item in data"><a href="{{item.url}}">{{ item.name }}</a>'+
                        '<ul>'+
                            '<li ng-repeat="subItem in item.subMenu">'+
                                '<a href="{{subItem.url}}">{{ subItem.name }}</a>'+
                            '</li>'+
                        '</ul>'+
                    '</li>'+
                  '</ul>',
        controller:function($scope, $interval) {
            $scope.firstloading = true
            $scope.$watch('data', function() {
            $interval(function(){
                if ($scope.firstloading) {
                    $('#mainMenu').wijmenu();
                    $scope.firstloading = false;
                } else {
                    $('#mainMenu').wijmenu('destroy').wijmenu();
                }
            },0,1); 
           });
        }
    }
};