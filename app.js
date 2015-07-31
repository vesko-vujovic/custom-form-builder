/*
 * Angular files for  custom-property builder
 */

var customForm = angular.module('form-builder', []);


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

            if(typeof scope.fieldData !== 'undefined' ){

                console.log(scope.fieldData.field_type);
            }

            scope.getTemplateUrl = function(type){
                return "input.html";
            }

        }
    };

}]);



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


    // Initialize Jquery UI widgets on the page
    $scope.startWidgets    = function(){
        $("#sortable").sortable({
            revert: true,
            update: function(event, ui){
               var index = ui.item.index();
               $scope.relaceDraggedElement(ui);
            }
        });

        // List draggable fields on the right
        $scope.listDraggableFields();

    };

    // Initialize draggable widget - this function will be called from $scope.listDraggableFields();
    $scope.initializeDrag   = function() {
        $('.drop li').draggable({
            connectToSortable: '#sortable',
            helper: 'clone',
            revert: 'invalid',
            start: function( event, ui ) {

            }
        });
    }

    // Replace dragged element on the right with adeuquate element
    $scope.relaceDraggedElement   = function(draggedElement){

            var typeOfField           = draggedElement.item.text();
            var currentElement        = draggedElement.item;
            var indexOfDraggedElement = draggedElement.item.index();
            console.log(indexOfDraggedElement);
        //
        switch (typeOfField){
            case 'input':
                // @param {object} - Create object for this dragged field
                var obj = $scope.createObjectForElement(indexOfDraggedElement, typeOfField);
                $(currentElement).replaceWith(
                    '<li data-type="' + obj.field_type + '" data-ref="' + obj.ref + '">' +
                    '<label>' + obj.key + '</label><input type="text" disabled=true>' +
                    '</li>'
                );
                $scope.tempStorageForObjects.push(obj);
                console.log(obj);
                break;
            case 'input-number':
                var obj = $scope.createObjectForElement(indexOfDraggedElement, typeOfField);
                $(currentElement).replaceWith(
                    '<li data-type="' + obj.field_type + '" data-ref="' + obj.ref + '">' +
                    '<label>' + obj.key + '</label><input type="number" disabled=true>' +
                    '</li>'
                );
                $scope.tempStorageForObjects.push(obj);
                break;
            case 'input-decimal':
                var obj = $scope.createObjectForElement(indexOfDraggedElement, typeOfField);
                $(currentElement).replaceWith(
                    '<li data-type="' + obj.field_type + '" data-ref="' + obj.ref + '">' +
                    '<label>' + obj.key + '</label><input type="number" set="any" disabled=true>' +
                    '</li>'
                );
                $scope.tempStorageForObjects.push(obj);
                break;


        }


    };


    // Watch when $scope.pallete is loaded then render left side field types
    $scope.listDraggableFields = function(){

        $scope.$watchCollection('pallete', function (newValue, oldValue) {

            if(newValue.length !== 0){
                for( var i = 0; i < $scope.pallete.length; i++) {
                    $(".drop").append('<li>' + $scope.pallete[i].type + '</li>');
                };
            }
            // After changing the DOM initialize draggable JqueryUI
            $scope.initializeDrag();
        });



    };

    // Create object for new dragged element
    $scope.createObjectForElement = function(index, typeOfField){

          var timestamp       =  Date.now();
          var dropdownOptions =  "";

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

    // Start the draggable and sortable widgets
    $scope.startWidgets();
}]);

// Cache templates
customForm.run(function($templateCache){
    $templateCache.put('input.html', '<label> Untitled <\/label> <div> <input type=\"text\" disabled=\"true\" > <\/div>');
    /*$templateCache.put('input-number.html', '<label> Untitled <\/label> <div> <input type=\"number\" disabled=\"true\" > <\/div>');
    $templateCache.put('input-decimal.html', '<label> Untitled  <\/label> <div> <input type=\"Number\" disabled=\"true\" step=\"any\"> <\/div>');
    $templateCache.put('textarea.html', '<label> Untitled  <\/label> <div> <textarea disabled=\"true\"><\/textarea> <\/div>');
    $templateCache.put('checkbox.html', '<label> Untitled  <\/label> <div> <input type=\"checkbox\" disabled=\"true\"> <\/div>');
    $templateCache.put('datepicker.html', '<label> Untitled  </label> <div> <input type="text" id="datepicker" disabled="true"> </div>'); */
});















