import React, { Component } from 'react';
import { WebView } from 'react-native';
import { Text, View, StyleSheet, StatusBar, ScrollView, Switch, TouchableNativeFeedback, TouchableHighlight, Platform, Alert, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../config/Constants';
import Utils from '../../utils/Utils';
const __CURRENT_VERSION__ = '1.0.0';
import ToastUtils from '../../utils/ToastUtils';

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class Radar extends Component {
    static navigationOptions = {
      title: 'Radar Map',
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
      this.state = {
        lat: '',
        lon: '',
      };
    }
    componentDidMount() {
      let item = this.props.navigation.getParam('item');
      this.setState({
        lat:item.city.coord.lat,
        lon:item.city.coord.lon,
      });
    }
    render() {
      const {lat, lon} = this.state;
      return (
        <WebView
          source={{uri: `${Constants.hostPrefix}/openweathermap/example/index.html?lat=${lat}&&lon=${lon}`}}
          style={{flex: 1}}
          injectedJavaScript={`
            
        `}
        />
      );
    }
}