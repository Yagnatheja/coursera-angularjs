
(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController',NarrowItDownController )
        .service('MenuSearchService',MenuSearchService)
        .directive('foundItems',FoundItems);


    function FoundItems()
    {
        var ddo=
            {
                templateUrl: 'menuItem.html',
                scope:
                {
                    theList: '<', 
                    onRemove: '&'
                },
                controller: FoundItemsDirectiveController,
                bindToController: true,
                controllerAs: 'list'
            };
        return ddo;
    }

    function FoundItemsDirectiveController()
    {
        var list=this;
        list.found = [];
        list.warningMessage = "";
    }


    NarrowItDownController.$inject=['MenuSearchService'];

    function NarrowItDownController(MenuSearchService)
    {
        var menu=this; 

        menu.narrowItDown = function()
        {
            MenuSearchService.getMatchedMenuItems(menu.searchTerm)
                .then(function(result)
                      {
                console.log(result);
                menu.found=result.foundItems;
                console.log(menu.found);
                if (result.foundItems.length == 0)
                {
                    menu.warningMessage = 'No Result Found';
                }
                else
                {
                    menu.warningMessage = "";
                }
            });
        };

        menu.removeItem = function (itemIndex) 
        {
            menu.found.splice(itemIndex,1);
        };

    } //End Of Controller Method

    MenuSearchService.$inject = ['$http']; 
    function MenuSearchService($http)
    {
        var service = this;
        service.getMatchedMenuItems = function(searchTerm)
        {

            return $http({
                method: "GET",
                url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
            }).then(function(result)
                    {
                var found = [];
                for(var i=0;i<result.data.menu_items.length;i++)
                {
                    if(searchTerm !== null && searchTerm !== "" &&
                       (result.data.menu_items[i].description.toLowerCase()).indexOf(searchTerm.toLowerCase()) !== -1)
                    {
                        found.push(result.data.menu_items[i]);
                    }
                }
                return {foundItems: found};
            }).catch(function (error) 
                     {
                console.log("Error while retrieving the data.");
                return {foundItems: []};
            });
        };
    }

})();