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
               // Replace dragged element with adequate template
                console.log(ui.item);
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
                console.log(ui.helper.text());
            }
        });
    }

    // Replace dragged element on the right with adeuquate element
    $scope.relaceDraggedElement   = function(draggedElement){

        // @param typeOfTheFiled - string
        var typeOfTheField   = draggedElement.item.text();
        var element   = draggedElement.item;

        switch (typeOfTheField){
            case "input":
                element.append();
                break;
            case "input-number":


        }
    };


    // Watch when $scope.pallete is loaded then render left side field types
    $scope.listDraggableFields = function(){

        $scope.$watchCollection("pallete", function (newValue, oldValue) {

            if(newValue.length !== 0){
                for(var i = 0; i < $scope.pallete.length; i++){
                    $(".drop").append("<li>" + $scope.pallete[i].type + "</li>");
                };
            }

            // After changing the DOM initialize draggable UI  for that elements
            $scope.initializeDrag();
        });



    };

    // Start the draggable and sortable widgets
    $scope.startWidgets();




}]);