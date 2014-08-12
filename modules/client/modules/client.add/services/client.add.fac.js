'use strict';

module.exports = function($http, $stateParams){
        var factory = {};
        factory.add = function(cl_jsonb) {
            var promise = $http.post('modules/client/modules/client.add/models/client.add.model.php', {
                    /* POST variables here */
                    cl_jsonb: cl_jsonb
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };