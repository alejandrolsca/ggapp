'use strict';

module.exports = function($http){
        var factory = {};
        factory.addData = function() {
            var promise = $http.post('modules/wo/modules/woAdd/models/woAddModel.php', {
                    /* POST variables here */
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };