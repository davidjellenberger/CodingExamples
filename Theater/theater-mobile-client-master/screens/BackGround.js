import React, { Component } from 'react';
import {Image, Text, StyleSheet, Button, View, Dimensions, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation'

export default class BackGround extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      backgroundColor: 'yellow'
    }; 
  }
  static navigationOptions = {
    header: null
 }
 render(){
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  const { navigate } = this.props.navigation;
  var media = this.props.navigation.state.params.media;
 return (
 <View style={{backgroundColor: media, flex: 1}}>
 </View>
 );
}
} 