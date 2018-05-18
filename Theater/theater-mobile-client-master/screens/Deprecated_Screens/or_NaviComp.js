import React, { Component } from 'react';
import Expo, {Audio} from 'expo';
import {Image, Text, StyleSheet, Button, View, Dimensions, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation'

const io = require('socket.io-client');
//let server = 'http://130.71.240.127:3000/';
//let server = 'http://192.168.137.100:3000/';
//let server = 'http://130.71.230.78:4000/';
//let server = 'http://172.58.83.155:3000/';
let server = 'http://192.168.43.70:3000/';
let socket = io(server, {
  transports: ['websocket']
});

const soundObject = new Expo.Audio.Sound();

export default class NaviComp extends React.Component {
  constructor(props){
    super(props);
    this._playAudio = this._playAudio.bind(this);
    this.state = {
      backgroundColor: 'black',
      seat: -1,
    }; 
  }
  static navigationOptions = {
    header: null
  }
  _playAudio = async(song)=>{
    await Expo.Audio.setIsEnabledAsync(true);
    try {
      await soundObject.loadAsync( {uri: song}, { shouldPlay: true });
      await soundObject.playAsync();
    } 
    catch (error) {
      console.log("ERROR With Audio Playback");
    }
  }
  _stopAudio(){
    soundObject.stopAsync();
  }
  _getSeat(s){
    if(s.indexOf(this.state.seat) == -1){
      return false;
    }
    return true;
  }

render(){
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  const { navigate } = this.props.navigation;
  socket.on('connect', function(){
    navigate('UI');
  });
  socket.on('json emission', json => {
    //console.log(json);
    //console.log(this.props.navigation.state.params.seat_number);
    var json_dump = JSON.parse(json);
    var navi = json_dump.action;
    var media = json_dump.media;
    var sound_bool = json_dump.sound_bool;
    var sound = json_dump.asset;
    var vibrate_bool = json_dump.vibrate_bool;
    var seats = json_dump.seats;
    if(this._getSeat(seats)){
      if(sound_bool == "true"){
        this._playAudio(sound);
      }
      if(vibrate_bool == "true"){
        var len = parseInt(json_dump.vibrate_length);
        Vibration.vibrate(len);
      }
      switch(navi){
        case 'image':
        navigate('IS', {media: media});
        break;
        case 'background':
        navigate('BG', {media: media});
        break;
        case 'flash':
        navigate('FL', {media: media});
        break;
        case 'buttons':
        navigate('BB');
        break;
        case 'video':
        navigate('VP', {media: media});
        break;
        case 'browser':
        navigate('BW', {media: media});
        break;
        default:
        console.log("Error invalid navigation command: " + navi);
        break;
      }
    }
  });
  return (
    <View style={{backgroundColor: this.state.backgroundColor, flex: 1}}>

    </View>
    );
  }
}