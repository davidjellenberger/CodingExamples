import React, { Component } from 'react';
import {Image, Text, StyleSheet, View, Dimensions, Vibration, TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Expo from 'expo';

export default class PhoneCall extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props){
    super(props);
  }


 render() {
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  const { navigate } = this.props.navigation;
  var contact = this.props.navigation.state.params.contact;
  var dialer = this.props.navigation.state.params.dialer;
  var audio = this.props.navigation.state.params.audio;
  var image = this.props.navigation.state.params.image;

  // var contact = "LiLDadHat";
  // var dialer = "Mobile"; 
  // var audio = "https://mixtapemonkey.com/mixtapes/zip/637/Chance%20The%20Rapper-%20Acid%20Rap/01.%20Good%20Ass%20Intro%20(Prod.%20by%20Peter%20Cottontale,%20Cam%20for%20J.U.S.T.I.C.E%20League%20&%20Stefan%20Ponce)%20.mp3";
  // var image = "https://i.imgur.com/fjoONay.jpg";

  Vibration.vibrate([0, 500, 200, 500], true);

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
            style={styles.Declinebutton}
            onPress={()=>{Vibration.cancel(); navigate('BG', {media: 'black'})}}>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Answerbutton}
            onPress={()=>{navigate('AC', {contact: contact, dialer: dialer, audio: audio, image: image})}}>
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
  Answerbutton: {
    alignItems: 'center',
    borderRadius: 90,
    width: 100,
    height: 100,
    backgroundColor: 'green',
    padding: 10,
    position: 'absolute',
    right: 25,
    bottom: 50
  },
  Declinebutton: {
    alignItems: 'center',
    borderRadius: 90,
    width: 100,
    height: 100,
    backgroundColor: 'red',
    padding: 10,
    position: 'absolute',
    left: 25,
    bottom: 50
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