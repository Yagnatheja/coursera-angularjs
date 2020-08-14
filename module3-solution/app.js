(function () {
    'use strict';
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsController,
            controllerAs: 'foundItemsCtrl',
            bindToController: true,
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;

        ctrl.narrowItDown = function () {
            console.log("Search Term : ",ctrl.searchTerm);
            var promise =  MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
            promise.then(getMatchedMenuItems);
        }

        function getMatchedMenuItems(response) {
            ctrl.found = response;
        }

        ctrl.removeItem = function (itemIndex) {
            ctrl.found.splice(itemIndex, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http,ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            });

            return response.then(function (result) {
                var foundItems = [];
                for (var i = 0; i < result.data.menu_items.length; i++) {
                    if (result.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(result.data.menu_items[i]);
                    }
                }
                return foundItems;
            })
                .catch(function (error) {
                console.log("Something went terribly wrong.");
            });
        }
    }
    function FoundItemsController() {
        var foundItemsCtrl = this;
        foundItemsCtrl.empty = function () {
            return (foundItemsCtrl.items !== undefined) && foundItemsCtrl.items.length == 0;
        }
    }
})();