/*
 * Angular files for  custom-property builder
 */

var customForm = angular.module('form-builder', ['ui.sortable']);


// Loads pallete of available fields, and html templates for that fields
customForm.service('getDataForCustomForm', function($http, $q){

    //Loading json file
    this.getData     = function() {

        var deferred = $q.defer();

        $http.get('custom-form.json')
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(err, status){
                deferred.reject(err);
            });

        return deferred.promise;

    };

    // Laoading initial data from database for CI Type
   this.getCiTypeData =  function() {

        var deferred = $q.defer();

        $http.get('custom-form-dummy.json')
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(err, status){
                deferred.reject(err);
            });

        return deferred.promise;
    };


});



// Directive that will load dynamic templates based on field type
customForm.directive('formfield', ['$compile', '$templateCache', function($compile, $templateCache){

    return {
        scope: {
            fieldData: '='
        },
        restrict: 'EA',
        template: '<ng-include src="' + 'getTemplateUrl()' +'"/>'
         ,
        link: function(scope, element, attribute){
    
            scope.getTemplateUrl = function(type){
                return "input.html";
            }

        }
    };

}]);

// Directive to signalize when ng-repeat has finished with DOM rendering
customForm.directive('onFinishRender', function ($timeout) {
return {
    restrict: 'A',
    link: function (scope, element, attr) {
        if (scope.$last === true) {
            $timeout(function () {
                scope.$emit('ngRepeatFinished');
            });
        }
    }
 }
});




// Define controller
customForm.controller('IndexController',  ['$scope', 'getDataForCustomForm', '$templateCache', function($scope, getDataForCustomForm, $templateCache){

    // @param initialCiData - json object
    $scope.initialCi = [];
    $scope.initialCiData    = getDataForCustomForm.getCiTypeData().then(function(data){
        $scope.initialCi    = data.groups;
    });

    // Temporary data storage for objects
    $scope.tempStorageForObjects = [];

    // Watch when async call is finished, then asign that data to tempStorageForObjects
    $scope.$watchCollection("initialCi", function(newValue, oldValue){

        if($scope.initialCi.length !== 0 ){
            $scope.tempStorageForObjects = $scope.initialCi.groups;
            // Find ondex of object where we have form property

        }
    });

    // Default sizes for elements
    $scope.defaultsForFields = {
        "width":    "200px",
        "heigth":   "50px",
        "key":      "Untitled"
    }


    // Variable initialization
    $scope.pallete      = "";
    $scope.templates    = "";
    $scope.palleteAndTemplatesData    = getDataForCustomForm.getData().then(function(data){
        $scope.pallete    = data.pallete;
        $scope.templates  = data.templates;
    });

    // Create object for new dragged element
    $scope.createObjectForElement = function(index, typeOfField){
          

          var timestamp       =  Date.now();
          var dropdownOptions =  "";
          //console.log(index);

          // If typeOfField is dropdown, make initial data for that element
          typeOfField == "dropdown" ? dropdownOptions = [{"state_id": 0, "name": "first_choice", "is_default": true, "deleted": false }] : dropdownOptions = [];

          var obj = {
              "id": 0,
              "new": 0,
              "ref": timestamp,
              "key": $scope.defaultsForFields.key,
              "field_type": typeOfField,
              "index": index,
              "required": true,
              "isCustomizable": 1,
              "width": "",
              "height": "",
              "dropdown_choices": dropdownOptions,
              "ci_type_id": 1234,
              "status": 0,
              "editable": true
          }

          return obj;
    };


    $scope.sortableOptions = {
        update: function(e, ui) {

            console.log(ui);
        }
    };

   

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
       
      /*  $(".sortable").sortable({
            revert: true,
            update: function(event, ui){
               var index        = ui.item.index();
               var typeOfField  = ui.item.text();
               $scope.createObjectForElement(index, typeOfField);
               console.log(typeOfField);
               
            }
        });   */
          
        $('.drop li').draggable({
            connectToSortable: '.sortable',
            helper: 'clone',
            revert: 'invalid',
            start: function( event, ui ) {

            }
        });

       
         // Start the draggable and sortable widgets when rendering finishes
         //$scope.startWidgets();
    });








}]);

// Cache templates
customForm.run(function($templateCache){
    $templateCache.put('input.html', '<label> Untitled {{ fieldData.field_type }} <\/label> <div> <input type=\"text\" disabled=\"true\" > <\/div>');
    /*$templateCache.put('input-number.html', '<label> Untitled <\/label> <div> <input type=\"number\" disabled=\"true\" > <\/div>');
    $templateCache.put('input-decimal.html', '<label> Untitled  <\/label> <div> <input type=\"Number\" disabled=\"true\" step=\"any\"> <\/div>');
    $templateCache.put('textarea.html', '<label> Untitled  <\/label> <div> <textarea disabled=\"true\"><\/textarea> <\/div>');
    $templateCache.put('checkbox.html', '<label> Untitled  <\/label> <div> <input type=\"checkbox\" disabled=\"true\"> <\/div>');
    $templateCache.put('datepicker.html', '<label> Untitled  </label> <div> <input type="text" id="datepicker" disabled="true"> </div>'); */
});















