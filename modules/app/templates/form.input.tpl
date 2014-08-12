<div class="form-group" > 
    <label class="col-sm-2 control-label">{{ "CLIENT.FIELDS.' + myField + '.NAME" | uppercase | i18n}}</label> 
    <div class="col-sm-4"> 
        <input type="text" class="form-control" name="field" ng-model="myModel" ng-required="required"> 
        <p >{{"CLIENT.FIELDS.' + myField  + '.INVALID" | uppercase | i18n}}</p> 
    </div> 
</div>