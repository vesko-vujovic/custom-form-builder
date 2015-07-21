/*
 * Angular files for  custom-property builder
 */

var customForm = angular.module('form-builder', []);


// Loads pallete of available fields, and html templates for that fields
customForm.service('getDataForCustomForm', function($http, $q){

    //Loading json file
    this.getData     = function(){
        var deferred = $q.defer();

        $http.get('custom-form.json')
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(err, status){
                deferred.reject(err);
            });

        return deferred.promise;

    }
});


// Define controller
customForm.controller('IndexController',  ['$scope', 'getDataForCustomForm', function($scope, getDataForCustomForm){

    $scope.pallete      = "";
    $scope.templates    = "";

    $scope.palleteAndTemplatesData    = getDataForCustomForm.getData().then(function(data){
        $scope.pallete    = data.pallete;
        $scope.templates  = data.templates;

    });



    // Update objects, for elemnts that are droped on the left
    $scope.updateObjects   = function(){

    }



    $scope.startWidgets    = function(){

        // Initialize sortable
        $("#sortable").sortable({
            revert: true,
            update: function(event, ui){
               console.log(ui.item.index());
               $scope.relaceDraggedElement(ui);
            }
        });

        //List dragable fields on the left
        $scope.listDraggableFields();

    };

    // Initialize draggable widget - this function will be called from $scope.listDraggableFields();
    $scope.initializeDrag   = function() {
        $(".drop li").draggable({
            connectToSortable: "#sortable",
            helper: "clone",
            revert: "invalid",
            start: function( event, ui ) {
                var type = ui.helper.text();

            }
        });
    }

    $scope.relaceDraggedElement   = function(element){
           var i;
           $(element.item).replaceWith('<li>' + $scope.templates[0].label   + '<div>' + $scope.templates[0].html + '</div>' + '</li> ');
    };





    // Watch when $scope.pallete is loaded then render left side fields
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