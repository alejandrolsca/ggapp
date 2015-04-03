(function(angular){
    'use strict';
    
    angular.module('gg-fields',[])
    
    .constant('validTypes',{
            "singleSpaces": /^([-,a-zA-Z0-9ÁáÉéÍíÓóÚú\.](.[-,a-zA-Z0-9ÁáÉéÍíÓóÚú\.])*)*$/,
            "rfc": /^[A-Za-z]{3,4}\-\d{6}(?:\-[A-Za-z\d]{3})?$/,
            "email": /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
            "decimal": /^(\d+\.\d{2,5})$/,
            "discount": /^(0\.\d{2,2})$/,
            "integer": /^\d$/,
            "zipcode": /^\d{5,5}$/,
            "date": /^\d{4}-\d{2}-\d{2}$/,
            "user": /^\w{4,16}$/,
            "password": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
            "phone": /^([+])?(\d{2,}-)*(\d{2,}-\d{2,})$/
    })
    
    .directive('ggInput',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    lblClass: '@',
                    fldClass: '@',
                    formGroupClass: '@',
                    fieldWrapperClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    ngChange: '&',
                    name: '@',
                    ngModel: '='
                },
                template: function(elem, attrs) {
                    var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                    var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                    
                    return '<div class="form-group {{formGroupClass}}">\
                                <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                <div class="{{fldClass}}">\
                                    <input class="form-control" type="text" name="name" ng-model="ngModel" ng-change="ngChange()" '+disabled+' '+required+'/>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p>\
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                </div>\
                          </div>';
                },
                link: function(scope, elem, attrs, ctrl){     
                    
                    var validator = function (value){
                        
                        if(angular.isDefined(value) || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };
                        
                        var required = (!angular.isDefined(value) && attrs.hasOwnProperty('required'));
                        var invalid = (angular.isDefined(value) && !validTypes[attrs.regexp].test(value));
                        
                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));
                        
                        scope.required = required;
                        scope.invalid = invalid;
                        
                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))
                        
                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
        };
    })
    
    .directive('ggPhone',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                    errClass: '@',
                    lbl: '@',
                    formGroupClass: '@',
                    fieldWrapperClass: '@',
                    lblClass: '@',
                    fldClass: '@',
                    reqMsg: '@',
                    regexpMsg: '@',
                    ngChange: '&',
                    name: '@',
                    ngModel: '='
                },
                template: function(elem, attrs) {
                    var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                    var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                    
                    return '<div class="form-group {{formGroupClass}}">\
                                <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                <div class="{{fldClass}}">\
                                    <input class="form-control" type="text" name="name" ng-model="ngModel" ng-change="ngChange()" '+disabled+' '+required+'/>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p>\
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    <div ng-show="validPhone">\
                                        <p>E164: <a href="tel:{{phone1}}">{{phone1}}</a></p>\
                                        <p>Nacional: <a href="tel:{{phone2}}">{{phone2}}</a></p>\
                                        <p>Internacional: <a href="tel:{{phone3}}">{{phone3}}</a></p>\
                                        <p>Original: <a href="tel:{{phone4}}">{{phone4}}</a></p>\
                                    </div>\
                                </div>\
                          </div>';
                },
                link: function(scope, elem, attrs, ctrl){
                    
                    var validator = function (value){
                        
                        if(angular.isDefined(value) || !ctrl.$pristine) {
                            ctrl.$setViewValue(value);
                        };
                        
                        var required = (!angular.isDefined(value) && attrs.hasOwnProperty('required')),
                        invalid = (angular.isDefined(value) && !phoneUtils.isValidNumber(value, 'MX')),
                        validPhone;
                        
                        
                        elem.toggleClass('has-error', (required || invalid));
                        elem.toggleClass('has-success', !(required || invalid));
                        
                        scope.required = required;
                        scope.invalid = invalid;
                                        
                        ctrl.$setValidity('valid', ((required || invalid) ? false : true))
                        
                        if (angular.isDefined(value)) {
                            validPhone = phoneUtils.isValidNumber(value, 'MX');
                        } else {
                            validPhone = false;
                        }
                        scope.validPhone = validPhone;
                        if (validPhone) {
                            scope.validPhone = true;
                            scope.phone1 = phoneUtils.formatE164(value, 'MX');
                            scope.phone2 = phoneUtils.formatNational(value, 'MX');
                            scope.phone3 = phoneUtils.formatInternational(value, 'MX');
                            scope.phone4 = phoneUtils.formatInOriginalFormat (value, 'MX');
                        } else {
                            scope.validPhone = false;
                            scope.phone1 = undefined;
                            scope.phone2 = undefined;
                            scope.phone3 = undefined;
                            scope.phone4 = undefined;
                        }
                        
                        return value;
                    }
                    //format text going to user (model to view)
                    ctrl.$formatters.unshift(validator);
                    //format text from the user (view to model)
                    ctrl.$parsers.unshift(validator);
                }
        };
    })
    
    .directive('ggSelect',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        formGroupClass: '@',
                        fieldWrapperClass: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        name: '@',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" name="name" ng-model="ngModel" ng-options="item.value as item.label for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl) {
                        
                        var validator = function (value){
                        
                            if(angular.isDefined(value) || !ctrl.$pristine) {
                                ctrl.$setViewValue(value);
                            };

                            var required = (!angular.isDefined(value) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(value) && !validTypes[attrs.regexp].test(value));

                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                            return value;
                        }
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(validator);
                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(validator);
                    }
            };
        })
    
        .directive('ggCountries',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        formGroupClass: '@',
                        fieldWrapperClass: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        ngChange: '&',
                        name: '@',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" name="name" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.countryName for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl){
                        
                        var validator = function (value){
                        
                            if(angular.isDefined(value) || !ctrl.$pristine) {
                                ctrl.$setViewValue(value);
                            };

                            var required = (!angular.isDefined(value) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(value) && !validTypes[attrs.regexp].test(value));

                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                            return value;
                        }
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(validator);
                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(validator);
                    }
            };
        })
    
        .directive('ggStates',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        formGroupClass: '@',
                        fieldWrapperClass: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        ngChange: '&',
                        name: '@',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" name="name" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.toponymName for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl, ggStatesCtrl){
                         
                        var validator = function (value){
                        
                            if(angular.isDefined(value) || !ctrl.$pristine) {
                                ctrl.$setViewValue(value);
                            };

                            var required = (!angular.isDefined(value) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(value) && !validTypes[attrs.regexp].test(value));

                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                            return value;
                        }
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(validator);
                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(validator);
                    }
            };
        })
    
        .directive('ggCityCounty',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        lbl: '@',
                        formGroupClass: '@',
                        fieldWrapperClass: '@',
                        lblClass: '@',
                        fldClass: '@',
                        reqMsg: '@',
                        regexpMsg: '@',
                        options: '=',
                        ngChange: '&',
                        name: '@',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        var multiple    = attrs.hasOwnProperty('multiple')  ? 'multiple'            : ''; //requires field
                        
                        return '<div class="form-group {{formGroupClass}}">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <select class="form-control" name="name" ng-model="ngModel" ng-change="ngChange()" ng-options="item.geonameId as item.toponymName for item in options" '+multiple+' '+disabled+' '+required+'>\
                                        </select>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl, ggStatesCtrl){
                        
                        var validator = function (value){
                        
                            if(angular.isDefined(value) || !ctrl.$pristine) {
                                ctrl.$setViewValue(value);
                            };

                            var required = (!angular.isDefined(value) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(value) && !validTypes[attrs.regexp].test(value));

                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                            return value;
                        }
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(validator);
                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(validator);
                    }
            };
        })
    
        .directive('ggTextarea',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        errClass: '@',
                        fldClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        name: '@',
                        ngModel: '=',
                        options: '=',
                        reqMsg: '@',
                        regexpMsg: '@',
                        rows: '@'
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        var required    = attrs.hasOwnProperty('required')  ? 'ng-required="true"'  : ''; //requires field
                        
                        return '<div class="form-group">\
                                    <label class="{{lblClass}} control-label">{{lbl}}</label>\
                                    <div class="{{fldClass}}">\
                                        <textarea class="form-control" name="name" ng-model="ngModel" rows="{{rows}}" '+disabled+' '+required+'>\
                                        </textarea>\
                                    <p ng-class="errClass" ng-show="required">{{reqMsg}}</p> \
                                    <p ng-class="errClass" ng-show="invalid">{{regexpMsg}}</p>\
                                    </div>\
                              </div>';
                    },
                    link: function(scope, elem, attrs, ctrl){
                        
                        var validator = function (value){
                        
                            if(angular.isDefined(value) || !ctrl.$pristine) {
                                ctrl.$setViewValue(value);
                            };

                            var required = (!angular.isDefined(value) && attrs.hasOwnProperty('required'));
                            var invalid = (angular.isDefined(value) && !validTypes[attrs.regexp].test(value));

                            elem.toggleClass('has-error', (required || invalid));
                            elem.toggleClass('has-success', !(required || invalid));

                            scope.required = required;
                            scope.invalid = invalid;

                            ctrl.$setValidity('valid', ((required || invalid) ? false : true))

                            return value;
                        }
                        //format text going to user (model to view)
                        ctrl.$formatters.unshift(validator);
                        //format text from the user (view to model)
                        ctrl.$parsers.unshift(validator);
                    }
            };
        })
        
        .directive('ggCheckbox',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        fldClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        name: '@',
                        ngModel: '='
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        
                        return '<div class="form-group">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                        <div class="checkbox" '+disabled+'>\
                                            <label>\
                                            <input type="checkbox" name="name" ng-model="ngModel" '+disabled+'> {{lbl}}\
                                            </label>\
                                        </div>\
                                    </div>\
                              </div>';
                    }
            };
        })
    
        .directive('ggRadio',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        fldClass: '@',
                        lbl: '@',
                        lblClass: '@',
                        name: '@',
                        ngModel: '=',
                        val: '@'
                    },
                    template: function(elem, attrs) {
                        var disabled    = attrs.hasOwnProperty('disabled')  ? 'ng-disabled="true"'  : ''; //disable field
                        
                        return '<div class="form-group">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                        <div class="radio" '+disabled+'>\
                                            <label>\
                                            <input type="radio" name="name" ng-model="ngModel" value="{{val}}" '+disabled+'> {{lbl}}\
                                            </label>\
                                        </div>\
                                    </div>\
                              </div>';
                    }
            };
        })
    
        .directive('ggSubmit',function(validTypes){
        return {
                restrict: "E",
                require: '^ngModel',
                scope: {
                        fldClass: '@',
                        lbl: '@',
                        formGroupClass: '@',
                        fieldWrapperClass: '@',
                        lblClass: '@',
                        ngDisabled: '=',
                        btnClass: '@'
                    },
                    template: function(elem, attrs) {
                        
                        return '<div class="form-group {{formGroupClass}}">\
                                    <div class="{{lblClass}} {{fldClass}}">\
                                            <button type="submit" class="btn btn-default {{btnClass}}" ng-disabled="ngDisabled">{{lbl}}</button>\
                                    </div>\
                              </div>';
                    }
            };
        })

})(angular);