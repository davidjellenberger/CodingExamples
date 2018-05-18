import React, { Component } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { Constants, WebBrowser } from 'expo';
import {StackNavigator} from 'react-navigation'

export default class Browser extends Component {
  state = {
    result: null,
  };

  render() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    const { navigate } = this.props.navigation;
    var media = this.props.navigation.state.params.media;
    let result = WebBrowser.openBrowserAsync(media);
    this.setState({ result });
    return (
      <View>  
      </View>
    );
  }
}