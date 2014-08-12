'use strict';

module.exports = function () {
    var validTypes = {
                "singleSpaces": /^[^ \t\s]?([-_a-zA-Z0-9ÁáÉéÍíÓóÚú\.](.[^ \t\s])*)*[^ \t\s]?$/,
                "rfc": /^[A-Za-z]{4}\-\d{6}(?:\-[A-Za-z\d]{3})?$/,
                "email": /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
                "decimal2": /^(\d+)?(\.\d{2,2})?$/,
                "integer": /^\d$/,
                "zipcode": /^\d{1,5}$/,
                "date": /^\d{4}-\d{2}-\d{2}$/,
                "user": /^\w{4,16}$/,
                "password": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
            };
    return {
        restrict: 'E',
        scope: {
            form: '@',
            field: '@',
            required: '@',
            valid: '@',
            ngModel: '='
        },
        template: function(elem, attrs){
            var html = '<div class="form-group" ng-class="{\'has-error\': ' + attrs.form + '.' + attrs.field + '.$invalid && !' + attrs.form + '.' + attrs.field + '.$pristine}"> \
                        <label class="col-sm-2 control-label">{{ "CLIENT.FIELDS."+field+".NAME" | uppercase | i18n}}</label> \
                        <div class="col-sm-4"> \
                            <input type="text" class="form-control" name="field" ng-model="ngModel" ng-required="required" ng-pattern="'+validTypes[attrs.valid]+'"> \
                            <p ng-show="' + attrs.form + '.' + attrs.field + '.$invalid && !' + attrs.form + '.' + attrs.field + '.$pristine">{{"CLIENT.FIELDS."+field+".INVALID" | uppercase | i18n}}</p> \
                        </div> \
                    </div>'
            console.log(html);
            return html;
        }
    };
}
//ng-class="{\'has-error\': [form].[field].$invalid && ![form].[field].$pristine}