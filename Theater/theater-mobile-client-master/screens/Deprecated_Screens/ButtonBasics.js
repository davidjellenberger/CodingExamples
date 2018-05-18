import React, { Component } from 'react';
import Expo, {Audio} from 'expo';
import {Image, Text, StyleSheet, Button, View, Dimensions, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation'

export default class ButtonBasics extends Component {
  static navigationOptions = {
    header: null
  };

  _displayImage() {

  }
  _playAudio = async()=>{
    console.log("HERE WE GO");
    await Expo.Audio.setIsEnabledAsync(true);
    const soundObject = new Expo.Audio.Sound();
    try {
      await soundObject.loadAsync(require('../assets/sounds/wind.mp3'));
      await soundObject.playAsync();
  // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  _vibrate() {
    Vibration.vibrate([0, 500, 200, 500,200,500,200,500,200,500,200,500,200], true);
  }
  _vibrateCancel() {
    Vibration.cancel()
  }

  render() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            //onPress={this._playAudio}
            title="Play Sound"
            color='red'
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._vibrate}
            title="Vibrate"
            color='blue'
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._vibrateCancel}
            title="Cancel Vibrate"
            color='purple'
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        margin: 20
    },
});