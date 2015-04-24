module.exports = (function(angular){
    'use strict';
    
    return function($http, $stateParams, $interval){
        var factory = {};
        factory.add = function(in_jsonb) {
            var promise = $http.post('modules/ink/modules/ink.add/ink.add.mdl.add.php', {
                    /* POST variables here */
                    in_jsonb: in_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        factory.getSuppliers = function() {
            var promise = $http.get('modules/ink/modules/ink.add/ink.add.mdl.getSuppliers.php')
            .success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };
    
})(angular);