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


// Define controller
customForm.controller('IndexController',  ['$scope', 'getDataForCustomForm', function($scope, getDataForCustomForm){

    // @param initialCiData - json object
    $scope.initialCi = [];
    $scope.initialCiData    = getDataForCustomForm.getCiTypeData().then(function(data){
        $scope.initialCi    = data.form;
    });

    // Temporary data storage for objects
    $scope.tempStorageForObjects = [];

    // Watch when async call is finished, then asign that data to tempStorageForObjects
    $scope.$watchCollection("initialCi", function(newValue, oldValue){

        if($scope.initialCi.length !== 0 ){
            $scope.tempStorageForObjects = $scope.initialCi;
        }
    });









    $scope.tempStorageForObjects  = $scope.initialCi;

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
        $(".drop li").draggable({
            connectToSortable: "#sortable",
            helper: "clone",
            revert: "invalid",
            start: function( event, ui ) {

            }
        });
    }

    // Replace dragged element on the right with adeuquate element
    $scope.relaceDraggedElement   = function(draggedElement){

            var typeOfField           = draggedElement.item.text();
            var currentElement        = draggedElement.item;
            var indexOfDraggedElement = draggedElement.item.index();

        // Make object for this element and push it on array

        switch (typeOfField){
            case "input":
                // Create object for dragged element
                var o = $scope.createObjectForElement(indexOfDraggedElement, typeOfField);
                $(currentElement).replaceWith("<li data-ref="+ o.ref + "> <input type='text'>  </li>")



        }


    };


    // Watch when $scope.pallete is loaded then render left side field types
    $scope.listDraggableFields = function(){

        $scope.$watchCollection("pallete", function (newValue, oldValue) {

            if(newValue.length !== 0){
                for(var i = 0; i < $scope.pallete.length; i++) {
                    $(".drop").append("<li>" + $scope.pallete[i].type + "</li>");
                };
            }

            // After changing the DOM initialize draggable UI  for that elements
            $scope.initializeDrag();
        });



    };

    // Create object for new dragged element
    $scope.createObjectForElement = function(index, typeOfField){

          var timestamp       =  Date.now();
          var dropdownOptions =  "";
          console.log(typeOfField);
          // If typeOfField is dropdown, make initial data for that element
          typeOfField == "dropdown" ? dropdownOptions = [{"state_id": 0, "name": "first_choice", "is_default": true, "deleted": false }]: dropdownOptions = [];

          var obj = {
              "id": 0,
              "new": 0,
              "ref": timestamp,
              "key": $scope.defaultsForFields.key,
              "index": index,
              "required": false,
              "isCustomizable": 1,
              "width": "",
              "height": "",
              "dropdown_choices": dropdownOptions,
              "cu_type_id": 1234,
              "status": 0,
              "editable": true
          }

          return obj;
    };



    // Start the draggable and sortable widgets
    $scope.startWidgets();




}]);