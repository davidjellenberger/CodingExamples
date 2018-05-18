import React, { Component } from 'react';
import {Image, Text, StyleSheet, Button, View, Dimensions, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation'

export default class Flash extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      backgroundColor: 'black',
      flash: true,
    };
    setInterval(() => {
      this.setState(previousState => {
        return { flash: !previousState.flash };
      });
    }, 
    500);
  }
  static navigationOptions = {
    header: null
  }
  render(){
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    const { navigate } = this.props.navigation;
    var media = this.props.navigation.state.params.media;
    var color = this.state.flash ? 'white' : media;
    return (
      <View style={{backgroundColor: color, flex: 1}}>
     </View>
     );
   }
 } 