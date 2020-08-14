(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', foundItemsDirective);

function foundItemsDirective(){
	var ddo = {
		restrict: "E",
		templateUrl : 'foundItems.html',
		scope : {
			onRemove : '&',
			items : '<'
		}
	};
	
	return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
	var menu = this;	
	menu.search = '';
	
	menu.getMatchedMenuItems = function(){
		var promise = MenuSearchService.getMenu(menu.search);
		menu.found = [];
		var notFound = false;
		
		promise.then(function (response) {
			
			for(var i=0;i<response.data.menu_items.length;i++){
				if(response.data.menu_items[i].description.indexOf(menu.search)>0 || menu.search.length == 0){
					menu.found.push(response.data.menu_items[i]);
				}
			}
			
			if(menu.found.length===0){
				menu.notFound = true;
			}else{
				menu.notFound = false;
			}
		})
		.catch(function (error) {
			console.log("Error on load search");
		});
	};
	
	menu.removeItem = function (itemIndex) {
		menu.found.splice(itemIndex,1);
		if(menu.found.length===0){
			menu.notFound = true;
		}else{
			menu.notFound = false;
		}
	};
}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMenu = function (description) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
    });
	
    return response;
  };
}

})();