import { ScrollView, StyleSheet, Text, View, StatusBar, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useStore } from '../store/store'
import ImageBackgroundInfo from '../components/ImageBackgroundInfo'
import { Row } from 'native-base'
import PaymentFooter from '../components/PaymentFooter'

const DetailsScreen = ({navigation, route} : any) => {
  const ItemOfIndex = useStore((state: any) => 
    route.params.type == 'Coffee' ? state.CoffeeList : state.BeanList, )[route.params.index] ;

  const BackHandler = () => {
    navigation.pop();
  }

  const [price, setPrice] = useState(ItemOfIndex.prices[0]);


  const [fullDesc, setfullDesc] = useState(false) ;

  const addToFavoriteList = useStore((state: any) => state.addToFavoriteList);
  const deleteFromFavouriteList = useStore((state: any) => state.deleteFromFavouriteList);

  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const ToggleFavourite = (favourite : Boolean, type : String, id : string) => {
    favourite ? (deleteFromFavouriteList(type, id)) : (addToFavoriteList(type, id))
  }

  const addToCartHandler =( {
    id, 
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    price,
  }: any) =>{
    addToCart({
    id, 
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices : [{...price, quantity:1}],
    });
    calculateCartPrice();
    navigation.navigate('Cart');
  }

  return (
   <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor = { COLORS.primaryBlackHex} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ styles.ScrollViewFlex } > 
        <ImageBackgroundInfo 
            EnableBackHandler = {true}
            imagelink_portrait = {ItemOfIndex.imagelink_portrait}
            type = { ItemOfIndex.type }
            id = { ItemOfIndex.id }
            favourite = { ItemOfIndex.favourite }
            name = { ItemOfIndex.name }
            special_ingredient = { ItemOfIndex.special_ingredient }
            ingredient = { ItemOfIndex.ingredients }
            average_rating = { ItemOfIndex.average_rating }
            ratings_count = { ItemOfIndex.ratings_count }
            roasted = { ItemOfIndex.roasted }
            BackHandler = { BackHandler}
            ToggleFavourite = { ToggleFavourite }
        />
        <View style={styles.footerInfoArea}> 
          <Text style={styles.infoTitle}>Description</Text>
          {fullDesc ? (
            <TouchableWithoutFeedback onPress={ () => setfullDesc(prev => !prev)}> 
              <Text style={styles.DescriptionText} >{ItemOfIndex.description} </Text>
            </TouchableWithoutFeedback>
          )  : (
          <TouchableWithoutFeedback onPress={()=> setfullDesc(prev => !prev)}>
            <Text numberOfLines={3} style={styles.DescriptionText}>
              {ItemOfIndex.description}
            </Text>
          </TouchableWithoutFeedback>
        )}

        <Text style={styles.infoTitle}>Size</Text>
        <View style={styles.SizeOuterContainer}>
          {ItemOfIndex.prices.map((data: any) => (
            <TouchableOpacity 
              key={data.size}
              onPress={() => {
                setPrice(data);
              }}
              style={[styles.SizeBox, 
                {
                  borderColor: 
                    data.size == price.size
                      ? COLORS.primaryOrangeHex
                      : COLORS.primaryDarkGreyHex,
                },
                  
                ]}>
                
                <Text style={[
                  styles.SizeText, 
                  {
                   fontSize: 
                     ItemOfIndex.type == 'bean'
                      ? FONTSIZE.size_14
                      : FONTSIZE.size_16,
                     color: 
                       data.size == price.size
                         ? COLORS.primaryOrangeHex
                         : COLORS.primaryLightGreyHex,
                }, 
                
                ]}>{data.size}</Text>
              </TouchableOpacity>
          ))}
           
        </View>
        </View>

        <PaymentFooter 
          price={price}
          buttonTitle='Add to Cart'
          buttonPressHandler={() => {
            addToCartHandler({
              id: ItemOfIndex.id,
              index: ItemOfIndex.index,
              name: ItemOfIndex.name,
              roasted: ItemOfIndex.roasted,
              imagelink_square: ItemOfIndex.imagelink_square,
              special_ingredient: ItemOfIndex.special_ingredient,
              type: ItemOfIndex.type,
              price : price,
            });
          }}></PaymentFooter>    

      </ScrollView>
   </View> 
  )
}

const styles = StyleSheet.create({
  ScrollViewFlex: {
    flexGrow:1,
    justifyContent: 'space-between'
  },
  ScreenContainer:{
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex
  },
  footerInfoArea:{
    padding: SPACING.space_20,
  },
  infoTitle:{
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    marginTop: SPACING.space_10
  },
  DescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginTop: SPACING.space_30
  },

  SizeOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_10,
  },
  
  SizeBox:{
    flex: 1,
    backgroundColor: COLORS.primaryGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_24 * 2,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
  },

  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
  },


})


export default DetailsScreen