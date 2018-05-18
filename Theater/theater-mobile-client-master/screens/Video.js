import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Expo, { Constants, Components, Video } from 'expo';
import {StackNavigator} from 'react-navigation'

export default class VideoPlayer extends React.Component {
  constructor(props){
    super(props);
  }
  static navigationOptions ={
    header: null
  }
  render() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);
    const{ navigate } = this.props.navigation;
    var media = this.props.navigation.state.params.media;
    return (
      <View style={styles.container}>
      <Video
      source={{ uri: media }}
      rate={1.0}
      volume={1.0}
      muted={false}
      resizeMode="cover"
      shouldPlay
      style={{
        width: Dimensions.get('window').height,
        height: Dimensions.get('window').width }}
      />
      </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#rgba(0,0,0,0.9)',
    },
  });