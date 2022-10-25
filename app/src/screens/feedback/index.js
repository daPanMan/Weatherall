import React, { Component } from 'react';
import { WebView } from 'react-native';
import { Text, View, StyleSheet, StatusBar, TextInput, Switch, TouchableNativeFeedback, TouchableHighlight, Platform, Alert, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../config/Constants';
import Utils from '../../utils/Utils';
const __CURRENT_VERSION__ = '1.0.0';
import ToastUtils from '../../utils/ToastUtils';
import { Button } from 'react-native-elements';
import Timeout from '../../utils/Timeout';

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class Radar extends Component {
    static navigationOptions = {
      title: 'FEEDBACK',
      // headerStyle: {
      //     height: APP_BAR_HEIGHT,
      //     backgroundColor: 'rgba(0, 0, 0, 0)',
      //     borderBottomWidth: 0,
      //     marginTop: Utils.isAndroid() ? STATUS_BAR_HEIGHT : 0,
      // },
      // headerTitleStyle: {
      //     marginStart: 0,
      //     fontSize: 18,
      // },
      // headerTintColor: 'white',
      // headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
      // headerTransparent: true,
    };
    constructor(props) {
      super(props);
      this.state = { text: '', user:{} };
    }

    componentDidMount() {
      this._getUser();
    }

    _getUser = async () => {
      let user = await AsyncStorage.getItem('userToken');
      this.setState({user});
      // alert(JSON.stringify(user))
    };

    render() {
      return (
        <View style={{flex:1}}>
          
          <TextInput
            style={{height: 200, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            multiline={true}
            numberOfLines={20}
            placeholder="Tell us your advice"
          />
          <Button
            title="Submit"
            onPress={() => {
              Timeout(fetch(`${Constants.hostPrefix}/feedback`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email:this.state.user,
                  feedback:this.state.text,
                }), 
              })).then((jsonData) => {
                ToastUtils.show('Thank you for your advice !');
              }).catch((error) => {
                ToastUtils.show('network error!');
              });
              
            }}
          />
          
        </View>
      );
    }
}

// var styles = StyleSheet.create({
//     animatedContainer: {
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     temperature: {
//       fontSize: 62,
//       fontWeight: '100',
//       margin: 0,
//       color:'#ffffff',

//     },
//     location: {
//       fontSize: 24,
//       fontWeight: '600',
//       marginBottom: 20,
//       color:'#ffffff',
//     },
//     weatherType: {
//       fontSize: 34,
//       fontWeight: '200',
//       color:'#ffffff',
//     },
    
//   });