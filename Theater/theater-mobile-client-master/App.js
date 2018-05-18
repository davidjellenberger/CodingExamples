import React, { Component } from 'react';
import {Image, Text, StyleSheet, Button, View, Dimensions, Vibration, Platform, BackHandler} from 'react-native';
import {StackNavigator} from 'react-navigation';
import NaviComp from './screens/NaviComp';
import BackGround from './screens/BackGround';
import ImageServer from './screens/ImageServer';
import VideoPlayer from './screens/Video';
import Flash from './screens/Flash';
import Browser from './screens/Browser';
import PhoneCall from './screens/PhoneCall';
import AnswerCall from './screens/AnswerCall';

const Navi = StackNavigator({
  NC: {screen: NaviComp},
  BG: {screen: BackGround},
  FL: {screen: Flash},
  IS: {screen: ImageServer},
  VP: {screen: VideoPlayer},
  BW: {screen: Browser},
  PC: {screen: PhoneCall},
  AC: {screen: AnswerCall},
  
});


export default class TheatreApp extends Component{
  constructor() {
    super();
    console.ignoredYellowBox = [
    'Setting a timer'
    ];
    }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }
  render(){
    return <Navi/>;
  }
}
