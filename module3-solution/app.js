
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
        list.noResult = "";
    }


    NarrowItDownController.$inject=['MenuSearchService'];

    function NarrowItDownController(MenuSearchService)
    {
        var narrow=this; 

        narrow.narrowItDown = function()
        {
            MenuSearchService.getMatchedMenuItems(narrow.searchTerm)
                .then(function(result)
                      {
                narrow.found=result.foundItems;
                if (result.foundItems.length == 0)
                {
                    narrow.noResult = 'No Result Found';
                }
                else
                {
                    narrow.noResult = "";
                }
            });
        };

        narrow.removeItem = function (itemIndex) 
        {
            narrow.found.splice(itemIndex,1);
        };

    } 

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
                var items=result.data.menu_items;
                var found = [];
                for(var i=0;i<items.length;i++)
                {
                    if(searchTerm !== null && searchTerm !== "" &&
                       (items[i].description.toLowerCase()).indexOf(searchTerm.toLowerCase()) !== -1)
                    {
                        found.push(items[i]);
                    }
                }
                return {foundItems: found};
            }).catch(function (error) 
                     {
                return {foundItems: []};
            });
        };
    }

})();