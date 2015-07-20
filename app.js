/*
 * Angular files for  custom-property builder
 */

var customForm = angular.module('form-builder', []);

// Define controller
customForm.controller('IndexController',  ['$scope', function($scope){

    // Pallete of field types that can be added to the form
    $scope.pallete = [
        {
            id: 0,
            type: "input"

        },
        {
            id: 1,
            type: "text area"
        },
        {
            id: 2,
            type: "checkbox"
        },
        {
            id: 3,
            type: "dropdown"
        },
        {
            id:4,
            type: "datepicker"
        }
    ];



    $scope.startWidgets = function(){

        $("#sortable").sortable({
            revert: true,
            update: function(event, ui){
                $(ui.item).replaceWith("<li><input type="+'text'+" ></li>");
            }
        });

        $scope.listDraggableItems();

        $(".drop li").draggable({
            connectToSortable: "#sortable",
            helper: "clone",
            revert: "invalid",
            start: function( event, ui ) {

            }
        });

    };
    // List  all item from field pallete
    $scope.listDraggableItems = function(){
        for(var i = 0; i < $scope.pallete.length; i++){
            $(".drop").append("<li id="+ 'draggable' +">" + $scope.pallete[i].type + "</li>");
        };

    }



    // Start the draggable and sortable
    $scope.startWidgets();




}]);