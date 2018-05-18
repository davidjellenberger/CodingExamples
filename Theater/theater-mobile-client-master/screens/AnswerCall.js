import React, { Component } from 'react';
import {Image, Text, StyleSheet, Button, View, Dimensions, Vibration, TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Expo, {Audio} from 'expo';

export default class PhoneCall extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props){
    super(props);
  }

  _playAudio = async(soundObject, song)=>{
    await Expo.Audio.setIsEnabledAsync(true);
    try {
      await soundObject.loadAsync( {uri: song}, { shouldPlay: true });
      await soundObject.playAsync();
    } 
    catch (error) {
      console.log("ERROR With Audio Playback");
    }
  }

 render() {
  Vibration.cancel();
  const soundObject = new Expo.Audio.Sound();
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  const { navigate } = this.props.navigation;
  var contact = this.props.navigation.state.params.contact;
  var dialer = this.props.navigation.state.params.dialer;
  var audio = this.props.navigation.state.params.audio;
  var image = this.props.navigation.state.params.image;
  this._playAudio(soundObject, audio);

  return (
    <View style={styles.all}>
      <Image 
        source={{uri: image}} 
        style={styles.fullscreen}
        blurRadius={1}
      >
        <Text style={styles.header}> {contact} </Text>
        <Text style={styles.headerSmall}> {dialer} </Text>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.HangUpbutton}
            onPress={()=>{soundObject.stopAsync(); navigate('BG', {media: 'black'})}}>
          </TouchableOpacity>
        </View>
      </Image>
    </View>
  );
 }
}

const styles = StyleSheet.create({
  fullscreen:{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  HangUpbutton: {
    position: 'absolute',
    left: '45%',
    bottom: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
    width: 100,
    height: 100,
    backgroundColor: 'red',
   
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 36,
    marginTop: 20,
    color: 'white',
    justifyContent: 'center',
  },
  headerSmall: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    color: 'white',
    justifyContent: 'center',
  },
  all: {
  }
});