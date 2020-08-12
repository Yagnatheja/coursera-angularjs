(function(){
    'use strict';
    
    angular.module('ShoppingListCheckOff',[])
    .controller('ToBuyController',ToBuyController)
    .controller('AlreadyBoughtController',AlreadyBoughtController)
    .service('ShoppingListCheckOffService',ShoppingListCheckOffService);
    
    ToBuyController.$inject=['ShoppingListCheckOffService'];
    
    function ToBuyController(ShoppingListCheckOffService){
        var shoppingList=this;
        
        shoppingList.items=[{itemName:'Cookies',itemQuantity:'5 Bags'},
                           {itemName:'Biscuits',itemQuantity:'10 Bags'},
                           {itemName:'Cokes',itemQuantity:'10 Bottles'},
                           {itemName:'Chocolates',itemQuantity:'3 Bags'},
                           {itemName:'Cakes',itemQuantity:'2 Kilos'}];
        
        shoppingList.removeItem=function(indx){
            var k=shoppingList.items.splice(indx,1)[0];
            ShoppingListCheckOffService.addItem(k);
            shoppingList.number_of_items=shoppingList.items.length;
        };

    }
    
    AlreadyBoughtController.$inject=['ShoppingListCheckOffService'];
    
    function AlreadyBoughtController(ShoppingListCheckOffService){
        var boughtList=this;
        
        boughtList.items=ShoppingListCheckOffService.items;
        
        boughtList.number_of_items=function(){
            return ShoppingListCheckOffService.returnCount();
        };
        
    }
    
    function ShoppingListCheckOffService(){
        var service=this;
        
        service.items=[];
        service.addItem=function(k){
          service.items.push(k);
        };
        
        service.returnCount=function(){
          return service.items.length;  
        };
            
    }
    
})();