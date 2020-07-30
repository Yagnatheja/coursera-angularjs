(function(){
    'use strict';
    angular.module('LunchCheck',[])
        .controller('LunchCheckController',LunchCheckController);

    function LunchCheckController($scope){
        $scope.test=function(){
            if(!$scope.dishes){
                $scope.test1="Input field shoud not be empty";
                $scope.colour="red";
            }
            else{
                $scope.colour="green";
                if($scope.dishes.split(',').filter(Boolean).length <= 3){
                    $scope.test1="Enjoy!";
                }
                else{
                    $scope.test1="Too Much!";
                }
            }
        };
    }
})();