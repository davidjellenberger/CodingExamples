import React, { Component } from 'react';
import Expo, {Audio} from 'expo';
import {Text, StyleSheet, Button, View, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation'

const soundObject = new Expo.Audio.Sound();
const audio = "https://mixtapemonkey.com/mixtapes/zip/637/Chance%20The%20Rapper-%20Acid%20Rap/01.%20Good%20Ass%20Intro%20(Prod.%20by%20Peter%20Cottontale,%20Cam%20for%20J.U.S.T.I.C.E%20League%20&%20Stefan%20Ponce)%20.mp3";

export default class ButtonPushing extends Component {
  static navigationOptions = {
    header: null
  };

  _vibrate() {
    Vibration.vibrate([0, 500, 200, 500,200,500,200,500,200,500,200,500,200], true);
  }
  _vibrateCancel() {
    Vibration.cancel()
  }

  _playSound = async(song)=>{
    try{
      await soundObject.loadAsync({uri: song},{shouldPlay: true});
      await soundObject.playAsync();
    }
    catch(error){
      console.log("There was an error");
    }
  }

  _stopSound(){
    soundObject.stopAsync();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={()=>{this._playSound(audio)}}
            title="Play Sound"
            color='green'
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._stopSound}
            title="Stop Sound"
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