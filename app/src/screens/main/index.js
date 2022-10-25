import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import moment from 'moment';
import PermissionsUtils from '../../utils/PermissionsUtils';
import ToastUtils from '../../utils/ToastUtils';
import eventProxy from '../../utils/eventProxy';
import Constants from '../../config/Constants';
// import Geolocation from 'Geolocation';
import LinearGradient from 'react-native-linear-gradient';
import Utils from '../../utils/Utils';
import CityListManager from '../../manager/CityListManager';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import WeatherComponent from '../../components/WeatherComponent';
import WeatherLineWidget from '../../widget/WeatherLineWidget';
import Icon from 'react-native-vector-icons/Ionicons';
import Timeout from '../../utils/Timeout';
// import {locationPermissionRequestSuccess} from '../../utils/location';
import weatherIcon from '../../../icon';
import SunriseAndSunsetComponent from '../../components/SunriseAndSunsetComponent';
import ForecastCard from '../../components/ForecastCard';
import AlertsCard from '../../components/AlertsCard';

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const TOP_HEIGHT = 96;

let currentTabIndex = 0;
let weatherComponentsArr;

/**
 * 天气预报主界面
 */
export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 正在定位中
      requestLocation: true,
      cityList: [],
      alerts:[],
      forecast:[],
      isRefreshing:false,
    };
  }

    static navigationOptions = ({ navigation, screenProps }) => ({
      headerStyle: {
        height: APP_BAR_HEIGHT,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderBottomWidth: 0,
        marginTop: Utils.isAndroid() ? STATUS_BAR_HEIGHT : 0,
      },
      headerTransparent: true,
      headerRight: navigation.state.params ? navigation.state.params.headerRight : null,
      headerLeft: navigation.state.params ? navigation.state.params.headerLeft : null,
    });

    /**
     * 右边设置按钮
     */
    _renderHeaderRight = () => {
      if (Utils.isAndroid()) {
        const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.4)', true);
        return (
          <TouchableNativeFeedback
            background={Ripple}
            onPress={() => this._systemSetting()}>
            <View style={{ padding: 4, marginEnd: 12 }}>


              <Icon name="ios-settings" color={'rgba(255, 255, 255, 0.9)'} size={24}
              />
            </View>
          </TouchableNativeFeedback>
        );
      }
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this._systemSetting()}>
          <View style={{ padding: 4, marginEnd: 12 }}>
            <Icon name="ios-settings" color={'rgba(255, 255, 255, 0.9)'} size={24}
            />
          </View>
        </TouchableOpacity>
      );
    };

    /**
     * 左边添加城市加号按钮
     */
    _renderHeaderLeft = () => {
      if (Utils.isAndroid()) {
        const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.4)', true);
        return (
          <TouchableNativeFeedback
            background={Ripple}
            onPress={() => this._addCity()}>
            <View style={{ padding: 4, marginStart: 12 }}>
              <Image source={require('../../../images/ic_add.png')} style={{
                width: 24, height: 24, resizeMode: 'cover', tintColor: 'rgba(255, 255, 255, 0.9)',
              }} />
            </View>
          </TouchableNativeFeedback>
        );
      }
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this._addCity()}>
          <View style={{ padding: 4, marginStart: 12 }}>
            <Image source={require('../../../images/ic_add.png')} style={{
              width: 24, height: 24, resizeMode: 'cover', tintColor: 'rgba(255, 255, 255, 0.9)',
            }} />
          </View>
        </TouchableOpacity>
      );
    };

    _addCity = () => {
      this.props.navigation.navigate('SelectCity', {
        callBack: (success, cityList) => {
          // success表示是否成功添加城市
          // cityList表示添加城市之后的缓存列表
          if (success) {
            this.refreshThisPage(cityList);
            // 跳转到刚刚添加的城市天气预报界面
            // this.tabView.goToPage(cityList.length - 1);
          }
        },
      });
    };

    refreshThisPage = (cityList) => {
      if (cityList && cityList.length > 0) {
        currentTabIndex = 0;
        this.setState({
          requestLocation: false,
          cityList: cityList,
        });
      }
    };

    _systemSetting = () => {
      this.props.navigation.navigate('Settings', {
        callBack: (success, cityList) => {
          // success表示是否成功添加城市
          // cityList表示添加城市之后的缓存列表
          if (success) {
            // this.refreshThisPage(cityList);
            // 跳转到刚刚添加的城市天气预报界面
            this.tabView.goToPage(cityList.length - 1);
          }
        },
      });
    };

    onRefresh = () => {
      this.setState({
        isRefreshing: true,
        forecast: [],
      });
      this.loadWeather();
    }

    // colors={['#464e96', '#547ea9', '#409aaf']}
    // colors={['rgb(27, 129, 167)', 'rgb(47, 166, 186)', 'rgb(109, 193, 193)']}
    render() {
      let data = this.state.alerts.concat(this.state.forecast);
      return (
        <LinearGradient colors={['#464e96', '#547ea9', '#409aaf']} style={{
          flex: 1,
        }}>
          <StatusBar
            barStyle={'light-content'}
            translucent={true}
            backgroundColor={'rgba(0, 0, 0, 0)'} />
          <View style={{
            flex: 1,
          }}>
            {this.state.requestLocation ?
              <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center',
                marginTop: STATUS_BAR_HEIGHT + APP_BAR_HEIGHT,
              }}>
                <ActivityIndicator size="large" color="#fff" />
              </View> :
              <View style={{
                flex: 1,
                marginTop: STATUS_BAR_HEIGHT,
                // marginTop: STATUS_BAR_HEIGHT + APP_BAR_HEIGHT
              }}>
                <FlatList data={data} style={{marginTop:20}} 
                  refreshing={this.state.isRefreshing}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isRefreshing}
                      onRefresh={this.onRefresh}
                      tintColor="#fff"
                      title="Loading..."
                      titleColor="#fff"
                      colors={['#fff']}
                      progressBackgroundColor="#204c09"
                    />
                  }
                  keyExtractor={item => item.dt_txt} renderItem={({item}) => {
                    console.log(item);

                    if (item.title) {
                      return <AlertsCard item={item}></AlertsCard>;
                    }
                    return <ForecastCard onPress={() => this.props.navigation.navigate('RadarPage', {
                      item,
                    })} detail={item} location={`${item.city.name},${item.city.country}`} />;
                  }} />
              </View>}
                   
          </View>
        </LinearGradient>
      );
    }

   

    

    

      

    componentDidMount() {
      this.loadWeather();

      eventProxy.on('loadWeather', (...args) => {
        this.onRefresh();
      });
      
    }

    loadWeather() {
      CityListManager.getCityList((cityList) => {
        console.log(cityList);
        Promise.all(
          cityList.map((city) => {
    
    
            let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city.district},${city.country}&units=metric&appid=${Constants.weather_api_key}`;
            return Timeout(fetch(url)).then((response) => {
              if (response.ok) {
                return response.json();
              }
            }).then((jsonData) => {
              // locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse);
              // setLoadingFalse && setLoadingFalse();
              // console.log(jsonData);
              // return jsonData;
          
          
              
              let forecast = jsonData.list[0];
              forecast.city = jsonData.city;
          
              this.setState({
                forecast: [...this.state.forecast, forecast],
                requestLocation: false,
              });
            }).catch((error) => {
              // console.log(error);
              ToastUtils.show(error.toString());
              this.setState({ requestLocation: false });
            });
          
          })
        ).then(() => {
          if (this.state.isRefreshing) {
            this.setState({isRefreshing:false});
          }
        }).catch(() => {
          if (this.state.isRefreshing) {
            this.setState({isRefreshing:false});
          }
        });
    
      });
            
      this.props.navigation.setParams({
        headerRight: this._renderHeaderRight(),
        headerLeft: this._renderHeaderLeft(),
      });
    
      // 检查是否有定位权限
      if (Utils.isAndroid()) {
        PermissionsUtils.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          () => {
            this.locationSuccess();
          }, () => {
            this.requestLocationPermission();
          });
      } else {
        this.locationSuccess();
      }

    }



    //默认地址为学校  不自动定位，自动定位需要去设置栏开启自动定位
    locationSuccess =() => {
      // navigator.geolocation.getCurrentPosition(
      //   location => {
      // 默认地址为学校
      // 纬度
      const latitude = 38.015707;
      // 经度
      const longitude = -122.585535;


      // fetch weather data
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${Constants.weather_api_key}`;
      Timeout(fetch(url)).then((response) => {
        if (response.ok) {
          return response.json();
        }
      }).then((jsonData) => {
        // locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse);
        // setLoadingFalse && setLoadingFalse();
        // console.log(jsonData);
        // return jsonData;


        // CityListManager.addCity(jsonData.cityid, jsonData.city.country, jsonData.city.name,
        //     jsonData.prov, -1, -1, -1, null, -1, false, (cityList) => {
        //     });
    
        let forecast = jsonData.list[0];
        forecast.city = jsonData.city;

        this.setState({
          forecast: [...this.state.forecast, forecast],
          requestLocation: false,
        });
      }).catch((error) => {
        // console.log(error);
        ToastUtils.show(error.toString());
        this.setState({ requestLocation: false });
      });

      let priviteKey = 'SxsbaD6W1IIEv3rf-';
      /**
                 * 
                 * weather alert triggers
                 * condition
                 * temp, pressure, humidity, wind_speed, wind_direction, clouds
                 */
      // let postTriggerData = {
      //     "time_period":{
      //        "start":{
      //           "expression":"after",
      //           "amount":132000000
      //        },
      //        "end":{
      //           "expression":"after",
      //           "amount":432000000
      //        }
      //     },
      //     "conditions":[
      //        {
      //           "name":"temp",
      //           "expression":"$gt",
      //           "amount":299
      //        }
      //     ],
      //     "area":[
      //        {
      //           "type":"Point",
      //           "coordinates":[
      //              53,
      //              37
      //           ]
      //        }
      //     ]
      //  }
      // let postTriggerUrl = `https://api.seniverse.com/v3/weather/alarm.json?key=${Constants.alerms_api_key}&location=${latitude}:${longitude}&language=en`;//&language=en
      // Timeout(fetch(postTriggerUrl)).then((response) => {
      //   if (response.ok) {
      //     return response.json();
      //   }
      // }).then((jsonData) => {
      //   // locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse);
      //   // setLoadingFalse && setLoadingFalse();
      //   // jsonData = {
      //   //     "results": [{ //当前全国或指定城市的气象灾害预警数组
      //   //       "location": { //第一个灾害预警的城市信息
      //   //         "id": "WM3B1R518R80",
      //   //         "name": "乐山",
      //   //         "country": "CN",
      //   //         "path": "乐山,乐山,四川,中国",
      //   //         "timezone": "Asia/Shanghai",
      //   //         "timezone_offset": "+08:00"
      //   //       },
      //   //       "alarms": [{ //该城市所有的灾害预警数组
      //   //         "title": "四川省乐山市气象台发布大雾黄色预警", //灾害预警
      //   //         "type": "大雾",
      //   //         "level": "黄色",
      //   //         "status": "预警中(V3版本默认为空)",
      //   //         "description": "我县出现能见度小于500米、大于等于200米的浓雾并将持续至10时左右，请注意交通安全，减少户外活动，预防浓雾带来的不利影响。",
      //   //         "pub_date": "2015-09-23T07:02:00+08:00（各级政府发布预警时间）"
      //   //       }]
      //   //     }, ]
      //   //   }
      //   let alerts = jsonData && jsonData.results && jsonData.results[0] && jsonData.results[0].alarms;
      //   // console.log(alerts);
      //   alerts && this.setState({
      //     alerts,
      //   });
      //   // return jsonData;

      //   // this.setState({
      //   //     forecast: jsonData,
      //   //     requestLocation: false,
      //   //   });
      // }).catch((error) => {
      //   console.log(error);
      //   ToastUtils.show(error.toString());
      //   // this.setState({ requestLocation: false });
      // });



      //   },
      //   error => {
      //     ToastUtils.show(error);
      //     // this.setState({ requestLocation: false });
      //   }
      // );
    }

    // 自动定位备份代码，现在改成默认地址为学校
    locationSuccessBackup =() => {
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
            // locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse);
            // setLoadingFalse && setLoadingFalse();
            // console.log(jsonData);
            // return jsonData;


            CityListManager.addCity(jsonData.cityid, jsonData.city.country, jsonData.city.name,
              jsonData.prov, -1, -1, -1, null, -1, false, (cityList) => {
              });
    
            let forecast = jsonData.list[0];
            forecast.city = jsonData.city;

            this.setState({
              forecast: [...this.state.forecast, forecast],
              requestLocation: false,
            });
          }).catch((error) => {
            // console.log(error);
            ToastUtils.show(error.toString());
            this.setState({ requestLocation: false });
          });

          let priviteKey = 'SxsbaD6W1IIEv3rf-';
          /**
                 * 
                 * weather alert triggers
                 * condition
                 * temp, pressure, humidity, wind_speed, wind_direction, clouds
                 */
          // let postTriggerData = {
          //     "time_period":{
          //        "start":{
          //           "expression":"after",
          //           "amount":132000000
          //        },
          //        "end":{
          //           "expression":"after",
          //           "amount":432000000
          //        }
          //     },
          //     "conditions":[
          //        {
          //           "name":"temp",
          //           "expression":"$gt",
          //           "amount":299
          //        }
          //     ],
          //     "area":[
          //        {
          //           "type":"Point",
          //           "coordinates":[
          //              53,
          //              37
          //           ]
          //        }
          //     ]
          //  }
          let postTriggerUrl = `https://api.seniverse.com/v3/weather/alarm.json?key=${Constants.alerms_api_key}&location=${latitude}:${longitude}&language=en`;//&language=en
          Timeout(fetch(postTriggerUrl)).then((response) => {
            if (response.ok) {
              return response.json();
            }
          }).then((jsonData) => {
            // locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse);
            // setLoadingFalse && setLoadingFalse();
            // jsonData = {
            //     "results": [{ //当前全国或指定城市的气象灾害预警数组
            //       "location": { //第一个灾害预警的城市信息
            //         "id": "WM3B1R518R80",
            //         "name": "乐山",
            //         "country": "CN",
            //         "path": "乐山,乐山,四川,中国",
            //         "timezone": "Asia/Shanghai",
            //         "timezone_offset": "+08:00"
            //       },
            //       "alarms": [{ //该城市所有的灾害预警数组
            //         "title": "四川省乐山市气象台发布大雾黄色预警", //灾害预警
            //         "type": "大雾",
            //         "level": "黄色",
            //         "status": "预警中(V3版本默认为空)",
            //         "description": "我县出现能见度小于500米、大于等于200米的浓雾并将持续至10时左右，请注意交通安全，减少户外活动，预防浓雾带来的不利影响。",
            //         "pub_date": "2015-09-23T07:02:00+08:00（各级政府发布预警时间）"
            //       }]
            //     }, ]
            //   }
            let alerts = jsonData && jsonData.results && jsonData.results[0] && jsonData.results[0].alarms;
            // console.log(alerts);
            alerts && this.setState({
              alerts,
            });
            // return jsonData;

            // this.setState({
            //     forecast: jsonData,
            //     requestLocation: false,
            //   });
          }).catch((error) => {
            console.log(error);
            ToastUtils.show(error.toString());
            // this.setState({ requestLocation: false });
          });



        },
        error => {
          ToastUtils.show(error);
          // this.setState({ requestLocation: false });
        }
      );
    }

    /**
     * 请求定位权限
     */
    requestLocationPermission = () => {
      PermissionsUtils.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        (successInfo) => {
          ToastUtils.show(successInfo);
          this.locationSuccess();
        }, (errorInfo) => {
          ToastUtils.show(errorInfo);
          // TODO  android 无权限 不应该去获取默认值
          this.locationSuccess();
        }, Constants.permission_tips.REQUEST_PERMISSION_SUCCESS, Constants.permission_tips.REQUEST_PERMISSION_FAILURE);
    };

    



    
}

var styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 62,
    fontWeight: '100',
    margin: 0,
    color:'#ffffff',

  },
  location: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color:'#ffffff',
  },
  weatherType: {
    fontSize: 34,
    fontWeight: '200',
    color:'#ffffff',
  },
    
});
