import React, { Component } from 'react';
import {Image, Text, StyleSheet, Button, View, Dimensions, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Expo from 'expo';

export default class ImageServer extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props){
    super(props);
  }

 _answer(audio){
  console.log("ACCEPT");
 }

 _decline(){
  console.log("DECLINE");
 }

 render() {
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  const { navigate } = this.props.navigation;
  var media = this.props.navigation.state.params.media;
  return(
   <Image 
   source={{uri: media}} 
   style={styles.fullscreen}
   />
   );
 }
}

const styles = StyleSheet.create({
  fullscreen: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
,});