import React, { Component } from 'react';
import Expo, {Audio} from 'expo';
import {Image, Text, TextInput, StyleSheet, Button, View, Dimensions, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation';
const qs = require('query-string');
import { SERVER_URL, SERVER_PORT } from '../config';

const io = require('socket.io-client');
let server = 'http://130.71.240.158:3000/';
let socket = io(server, {
  transports: ['websocket']
});

export default class NaviComp extends React.Component {
  constructor(props){
    super(props);
    this._playAudio = this._playAudio.bind(this);
    this.state = {
      backgroundColor: 'black',
      seat: -1,
      first: '', 
      last: '',
      splash: "https://i.pinimg.com/736x/ab/b4/28/abb4284adef1e0a563393ad06b69ea42--thor-avengers-hulk-marvel.jpg",
    }; 
    this._submit_data = this._submit_data.bind(this);
  }
  static navigationOptions = {
    header: null
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

  _stopAudio(soundObject){
    soundObject.stopAsync();
  }

  _getSeat(s){
    if(s.indexOf(parseInt(this.state.seat)) == -1){
      return false;
    }
    return true;
  }

  _submit_data() {
    const { navigate } = this.props.navigation;
    var json_blob = new Object();
    json_blob.first_name = this.state.first;
    json_blob.last_name = this.state.last;
    json_blob.seat_number = this.state.seat;
    var json_blob_string = JSON.stringify(json_blob);
    const string_url = qs.stringify(json_blob);
    var url = SERVER_URL+string_url;
    //console.log(SERVER_URL);
    //fetch command here
    //getSplash Screen image url
    Vibration.vibrate([0, 500, 200, 500], false);
    navigate('IS', {media: this.state.splash} );
  }

render(){
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  const { navigate } = this.props.navigation;
  const soundObject = new Expo.Audio.Sound();
  socket.on('connect', function(){
    console.log("Connected on Mobile Device");
  });
  socket.on('json emission', json => {
    //console.log(json);
    //console.log(this.props.navigation.state.params.seat_number);
    var json_dump = JSON.parse(json);
    var navi = json_dump.action;
    var seats = json_dump.seats;
    var all = json_dump.all;
    var a = this._getSeat(seats);
    var b = all == "true" && this.state.seat != -1;
    
    //this is for phone calls the JSON will be different
    if( (a || b) && navi == 'phonecall' ){
      var contact = json_dump.contact;
      var dialer = json_dump.dialer;
      var audio = json_dump.audio;
      var image = json_dump.image;

      navigate('PC', {contact: contact, dialer: dialer, audio: audio, image: image});
    }
    else if(a || b){
      var media = json_dump.media;
      var sound_bool = json_dump.sound_bool;
      var sound = json_dump.asset;
      var vibrate_bool = json_dump.vibrate_bool;
      if(sound_bool == "true"){
        this._playAudio(soundObject, sound);
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
    <View style={styles.container}>
      <TextInput
      style = {{height: 40}}
      placeholder="First Name"
      onChangeText={(first) => this.setState({first})}
      />
      <TextInput
      style = {{height: 40}}
      placeholder="Last Name"
      onChangeText={(last) => this.setState({last})}
      />
      <TextInput
      style = {{height: 40}}
      placeholder="Seat Number"
      onChangeText={(seat) => this.setState({seat})}
      />
      <View style={styles.buttonContainer}>
      <Button
      onPress={this._submit_data}
      title="Submit"
      color='black'
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