'use strict';

module.exports = function($http, $stateParams){
        var factory = {};
        factory.updateData = function() {
            var promise = $http.post('modules/wo/modules/woUpdate/models/woUpdateModel.php', {
                    /* POST variables here */
                    wo_id: $stateParams.wo_id
            }).success(function(data, status, headers, config){
                return data;
            }).error(function (data, status, headers, config) {
                return {"status": false};
            });
            return promise;
        };
        return factory;
    };