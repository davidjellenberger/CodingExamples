import React, { Component } from 'react';
import {Image, Text, TextInput, StyleSheet, Button, View, Dimensions, Vibration} from 'react-native';
import {StackNavigator} from 'react-navigation';
const qs = require('query-string');
import { SERVER_URL, SERVER_PORT } from '../config';

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '', 
      last: '',
      seat: '',
      splash: "https://i.pinimg.com/736x/ab/b4/28/abb4284adef1e0a563393ad06b69ea42--thor-avengers-hulk-marvel.jpg",
    };
    this._submit_data = this._submit_data.bind(this);
  }
  static navigationOptions = {
    header: null
  };
  _submit_data() {
    const { navigate } = this.props.navigation;
    var json_blob = new Object();
    json_blob.first_name = this.state.first;
    json_blob.last_name = this.state.last;
    json_blob.seat_number = this.state.seat;
    var json_blob_string = JSON.stringify(json_blob);
    const string_url = qs.stringify(json_blob);
    var url = SERVER_URL+string_url;
    console.log(SERVER_URL);
    //fetch command here

    //getSplash Screen image url
    Vibration.vibrate([0, 500, 200, 500], false);
    navigate('IS', {media: this.state.splash} );
  }

  render() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    const { navigate } = this.props.navigation;
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