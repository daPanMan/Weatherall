/*
 * 设置界面
 */

import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, Switch, TouchableNativeFeedback, TouchableWithoutFeedback, Platform, Alert, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Divider from '../../components/divider';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../config/Constants';
import Utils from '../../utils/Utils';
const __CURRENT_VERSION__ = '1.0.0';
import ToastUtils from '../../utils/ToastUtils';
import {locationPermissionRequestSuccess} from '../../utils/location';
import Timeout from '../../utils/Timeout';
import CityListManager from '../../manager/CityListManager';
import eventProxy from '../../utils/eventProxy';

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class SettingScreen extends Component {
    static navigationOptions = {
      title: 'Settings',
      headerStyle: {
        height: APP_BAR_HEIGHT,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderBottomWidth: 0,
        // marginTop: Utils.isAndroid() ? STATUS_BAR_HEIGHT : 0,
      },
      headerTitleStyle: {
        marginStart: 0,
        fontSize: 18,
      },
      headerTintColor: 'white',
      headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
      headerTransparent: true,
    };

    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
        unitF:false,  // 温度单位为F 默认不开启
      };
    }
    componentDidMount() {
      let unitF = this.getUnitF().then((v)=>{
        console.log(v)
        if(v==0){
          this.setState({
            unitF:false
          })
        }else{
          this.setState({
            unitF:true
          })
        }
        
  
      })
    }
    getUnitF=async()=>{
      let unitF = await AsyncStorage.getItem('unitF');
      return unitF;
    }

    _cleanStorage = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('unitF');
        await AsyncStorage.removeItem(Constants.city_list);
        // ToastUtils.show('clear storge success');
        this.props.navigation.navigate('SignIn');
      } catch (error) {
        // Error retrieving data
      }
     
    };

    // 反馈
    _feedback = () => {
      this.props.navigation.navigate('Feedback');

    }

    _location = () => {
      // locationPermissionRequestSuccess(null, true);


      navigator.geolocation.getCurrentPosition(
        location => {
          // 纬度
          const latitude = location.coords.latitude;
          // 经度
          const longitude = location.coords.longitude;


          // fetch weather data
          let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${Constants.weather_api_key}`;
          Timeout(fetch(url)).then((response) => {
            if (response.ok) {
              return response.json();
            }
          }).then((jsonData) => {
            CityListManager.addCity(jsonData.cityid, jsonData.city.country, jsonData.city.name,
              jsonData.prov, -1, -1, -1, null, -1, false, (cityList) => {
              });
    
            let forecast = jsonData.list[0];
            forecast.city = jsonData.city;
            ToastUtils.show('location success');
          }).catch((error) => {
            // console.log(error);
            ToastUtils.show(error.toString());
            this.setState({ requestLocation: false });
          });

        },
        error => {
          ToastUtils.show(error);
          // this.setState({ requestLocation: false });
        }
      );



        

    }



    render() {
      return (
        <LinearGradient colors={['#464e96', '#547ea9', '#409aaf']} style={{
          flex: 1,
        }}>
          <View style={{
            flex: 1,
            marginTop: STATUS_BAR_HEIGHT + APP_BAR_HEIGHT,
          }}>
            <ScrollView>
              {this._renderColumn()}

            </ScrollView>
          </View>
        </LinearGradient>
      );
    }


    _renderColumn = () => {
      console.log(this.state.unitF)
      return (
        <Fragment>
          <TouchableWithoutFeedback
            // underlayColor={pressButtonColor}
            onPress={this._cleanStorage}>
            <View style={[styles.itemContainer, { marginTop: 20 }]}>
              <Text style={styles.text}>logout</Text>
              <Icon name="ios-arrow-forward" color={'rgb(54,57,66)'} size={15}
                style={{ backgroundColor: 'transparent', marginRight: 20 }} />
            </View>
          </TouchableWithoutFeedback>
          <Divider dividerHeight={1} />
          <TouchableWithoutFeedback
            // underlayColor={pressButtonColor}
            onPress={this._location}>
            <View style={[styles.itemContainer, { marginTop: 20 }]}>
              <Text style={styles.text}>auto location</Text>
              <Icon name="ios-arrow-forward" color={'rgb(54,57,66)'} size={15}
                style={{ backgroundColor: 'transparent', marginRight: 20 }} />
            </View>
          </TouchableWithoutFeedback>
          <Divider dividerHeight={1} />

          <TouchableWithoutFeedback
            // underlayColor={pressButtonColor}
            onPress={this._feedback}>
            <View style={[styles.itemContainer, { marginTop: 20 }]}>
              <Text style={styles.text}>feedback</Text>
              <Icon name="ios-arrow-forward" color={'rgb(54,57,66)'} size={15}
                style={{ backgroundColor: 'transparent', marginRight: 20 }} />
            </View>
          </TouchableWithoutFeedback>
          <Divider dividerHeight={1} />

          <View style={[styles.itemContainer, { marginTop: 20 }]}>
          <Text style={styles.text}>unit &#176;F</Text>
            <Switch onValueChange = {(v)=>{
              this.setState({unitF:v})
              if(v){
                AsyncStorage.setItem('unitF','1');
              }else{
                AsyncStorage.setItem('unitF','0');
              }
              setTimeout(()=>{
                eventProxy.trigger('loadWeather');
              },100)
            }} value={this.state.unitF}/>
            </View>
          {/* <TouchableWithoutFeedback
                    // underlayColor={pressButtonColor}
                    onPress={()=>{
                        this.props.navigation.navigate('RadarPage', {
                            
                        });
                    }}>
                    <View style={[styles.itemContainer, { marginTop: 20 }]}>
                        <Text style={styles.text}>Weather Map</Text>
                        <Icon name="ios-arrow-forward" color={'rgb(54,57,66)'} size={15}
                            style={{ backgroundColor: 'transparent', marginRight: 20 }} />
                    </View>
                </TouchableWithoutFeedback> */}
          {/* <Divider dividerHeight={1} />
                <TouchableWithoutFeedback
                    // underlayColor={pressButtonColor}
                    >
                    <View style={[styles.itemContainer, { marginTop: 20 }]}>
                        <Text style={styles.text}>推送设置</Text>
                        <Icon name="ios-arrow-forward" color={'rgb(54,57,66)'} size={15}
                            style={{ backgroundColor: 'transparent', marginRight: 20 }} />
                    </View>
                </TouchableWithoutFeedback>
                <Divider dividerHeight={1} />
                <TouchableWithoutFeedback
                    // underlayColor={pressButtonColor}
                    >
                    <View style={[styles.itemContainer, { marginTop: 20 }]}>
                        <Text style={styles.text}>语言设置</Text>
                        <Icon name="ios-arrow-forward" color={'rgb(54,57,66)'} size={15}
                            style={{ backgroundColor: 'transparent', marginRight: 20 }} />
                    </View>
                </TouchableWithoutFeedback>
                <Divider dividerHeight={1} />
                <TouchableWithoutFeedback
                    // underlayColor={pressButtonColor}
                   >
                    <View style={[styles.itemContainer, { marginTop: 20 }]}>
                        <Text style={styles.text}>单位设置</Text>
                        <Icon name="ios-arrow-forward" color={'rgb(54,57,66)'} size={15}
                            style={{ backgroundColor: 'transparent', marginRight: 20 }} />
                    </View>
                </TouchableWithoutFeedback> */}
          <Divider dividerHeight={1} />
          <TouchableWithoutFeedback
            // underlayColor={pressButtonColor}
          >
            <View style={[styles.itemContainer, { marginTop: 20 }]}>
              <Text style={styles.text}>version</Text>
              <Text style={[styles.text, { marginRight: 20 }]}>V{__CURRENT_VERSION__}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Divider dividerHeight={1} backgroundColorValue={'rgba(237,241,242,0.3)'} />
        </Fragment>
      );
    };
    
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginLeft: 20,
    fontSize: 15,
  },

  itemContainer: {
    flexDirection: 'row',
    height: 53,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemRight: {
    marginRight: 20,
  },
});
