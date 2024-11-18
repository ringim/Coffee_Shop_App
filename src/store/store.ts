import { create } from "zustand";
import { produce } from "immer";
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CoffeeData from "../data/CoffeeData";
import BeansData from "../data/BeansData";


export const useStore = create(

    persist(
        (set, get) => ({
            CoffeeList: CoffeeData,
            BeanList: BeansData,
            CartPrice: 0,
            FavouriteList: [],
            CartList: [],
            OrderHistoryList: [],
            addToCart: (cartItem : any) =>set(
                produce(state => {
                    let found = false;
                    
                    // Loop through the CartList to check if the item already exists
                    for (let i = 0; i < state.CartList.length; i++) {
                        if (state.CartList[i].id == cartItem.id) {
                            found = true;
                            let size = false;
                            
                            // Check if the size of the item already exists in the prices array
                            for (let j = 0; j < state.CartList[i].prices.length; j++) {
                                if( state.CartList[i].prices[j].size == cartItem.prices ){
                                    size = true;
                                    state.CartList[i].prices[j].quantity++ ;
                                    break;
                                }
                            }

                            // If the size doesn't exist, add it to the prices array
                            if( size == false ){
                                state.CartList[i].prices.push(cartItem.prices[0]) ;
                            }

                            // Sort the prices array by size
                            state.CartList[i].prices.sort((a: any, b: any) => {
                                if(a.size > b.size) {
                                    return -1;
                                }
                                if(a.size < b.size){
                                    return 1;
                                }
                                return 0; // Corrected to return 0 for equal sizes
                            });
                            break;
                        }
                    }    
                    // If the item doesn't exist in the Cart, add it
                    if(found == false){
                        state.CartList.push(cartItem);
                    } 
                
                    // Calculate the cart price after adding the item
                 //state.calculateCartPrice(); // Ensure this is called to update CartPrice
                
            })
        ),

        // Calculate Cart Price
        calculateCartPrice: () => set(produce(state => {
            // const totalPrice =state.CartList.reduce((acum,currentValue)=>acum+currentValue.price,0)
  
           
            let totalprice = 0;
            
            // Loop through the CartList to calculate the total price
            for (let i = 0; i < state.CartList.length; i++) {
                let tempprice = 0; 
                
                // Calculate the price for each item based on its quantity
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                    tempprice += parseFloat(state.CartList[i].prices[j].price) * state.CartList[i].prices[j].quantity; // Corrected index from i to j
                }
                state.CartList[i].itemPrice = tempprice.toFixed(2); // Store the item price
                totalprice += tempprice; // Accumulate the total price
            }
            state.CartPrice = totalprice.toFixed(2); // Update the total cart price
        })),

        addToFavoriteList: (type: string, id: string) =>
            set(
                produce(state => {
                    // Check if the item is Coffee
                    if (type == 'Coffee') {
                        for (let i = 0; i < state.CoffeeList.length; i++) {
                            if (state.CoffeeList[i].id == id) {
                                // If the item is not already a favorite, mark it as one and add to FavoriteList
                                if (state.CoffeeList[i].favourite == false) {
                                    state.CoffeeList[i].favourite = true; // Corrected assignment operator
                                    state.FavouriteList.unshift(state.CoffeeList[i]);
                                }
                                break;
                            }
                        }
                    } 
                    // Check if the item is Bean
                    else if (type == 'Bean') {
                        for (let i = 0; i < state.BeanList.length; i++) {
                            if (state.BeanList[i].id == id) {
                                // If the item is not already a favorite, mark it as one and add to FavoriteList
                                if (state.BeanList[i].favourite == false) {
                                    state.BeanList[i].favourite = true; // Corrected assignment operator
                                    state.FavouriteList.unshift(state.BeanList[i]);
                                }
                                break;
                            }
                        }
                    }
                }),
            ),
            deleteFromFavouriteList: (type : string, id : string) => set(produce(state => {
                if(type == 'Coffee'){
                    for (let i = 0; i < state.CoffeeList.length; i++) {
                        if (state.CoffeeList[i].id == id) {
                           
                            if (state.CoffeeList[i].favourite == true) {
                                state.CoffeeList[i].favourite = false; 
                                
                            }
                            break;
                        }
                    }
                } else {
                    if(type == 'Bean'){
                        for (let i = 0; i < state.BeanList.length; i++) {
                            if (state.BeanList[i].id == id) {
                  
                                if (state.BeanList[i].favourite == true) {
                                    state.BeanList[i].favourite = false; 
                                    
                                }
                                break;
                            }
                        }
                    }

                    let spliceIndex = -1;
                    for(let i = 0; i <state.FavoriteList.length;i ++){
                        if(state.FavoriteList[i].id == id){
                            spliceIndex = i;
                            break;
                        }
                    }
                 state.FavoriteList.splice(spliceIndex, 1);
                }
            })),


            incrementCartItemQuantity: (id : string, size: string) => 
                set(produce(state => {
                    for (let i = 0; i < state.CartList.length; i++) {
                        if (state.CartList[i].id == id) {
                            for(let j=0; j<state.CartList[i].prices.length;j++){
                                if(state.CartList[i].prices[j].size == size){
                                    state.CartList[i].prices[j].quantity += 1;
                                    break;
                                }
                            }
                        }

                    }
            }
            )),

            decrementCartItemQuantity: (id: string, size: string) =>
                set(
                  produce(state => {
                    for (let i = 0; i < state.CartList.length; i++) {
                      if (state.CartList[i].id === id) {
                        for (let j = 0; j < state.CartList[i].prices.length; j++) {
                          if (state.CartList[i].prices[j].size === size) {
                            // Check if the quantity is greater than 1
                            if (state.CartList[i].prices[j].quantity > 1) {
                              state.CartList[i].prices[j].quantity--; // Just decrement the quantity
                            } else {
                              // If quantity is 1, remove the specific size option from prices
                              state.CartList[i].prices.splice(j, 1);
                            }
              
                            // If no sizes are left in the prices array, remove the product from CartList
                            if (state.CartList[i].prices.length === 0) {
                              state.CartList.splice(i, 1);
                            }
                            break;
                          }
                        }
                        break;
                      }
                    }
                  })
                ),
              

                addToOrderHistoryFromCart : () => set(produce(state => {
                    produce(state => {
                        let temp = state.CartList.reduce(
                            (accumulator: number, currentValue: any) =>
                                accumulator + parseFloat(currentValue.itemPrice),
                            0,
                        );

                        if(state.OrderHistoryList.length > 0){
                            state.OrderHistoryList.unshift({
                                OrderDate: new Date().toDateString() + ' ' + new Date().toLocaleTimeString(),
                                CartList: state.CartList,
                                CartListPrice: temp.toFixed(2).toString(),
                            });
                        }
                        else{
                            state.OrderHistoryList.push({
                                OrderDate: new Date().toDateString() + ' ' + new Date().toLocaleTimeString(),
                                CartList: state.CartList,
                                CartListPrice: temp.toFixed(2).toString(),
                            });
                        }
                        state.CartList = [];
                    })
                }))

        }),
        {
            name: 'coffee-app',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)