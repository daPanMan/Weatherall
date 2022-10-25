import React, {Component} from 'react';
import {
  StatusBar,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput, ActivityIndicator,
  TouchableNativeFeedback,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../config/Constants';
import Utils from '../../utils/Utils';
import ToastUtils from '../../utils/ToastUtils';
import CityListManager from '../../manager/CityListManager';
import Timeout from '../../utils/Timeout';
import eventProxy from '../../utils/eventProxy';
import Loading from '../../components/Loading';
import checkEmpty from '../../utils/checkEmpty';

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class SelectCityPage extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
      title: 'add city',
      headerStyle: {
        height: APP_BAR_HEIGHT,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderBottomWidth: 0,
        marginTop: Utils.isAndroid() ? STATUS_BAR_HEIGHT : 0,
      },
      headerTitleStyle: {
        marginStart: 0,
        fontSize: 18,
      },
      headerTintColor: 'white',
      headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
      headerTransparent: true,
      headerRight: navigation.state.params ? navigation.state.params.headerRight : null,
    });

    constructor(props) {
      super(props);
      this.state = {
        navigation: props.navigation,
        // 是否显示查询城市列表
        showSearchResult: false,
        // 国内热门城市列表
        nationalHotList: [],
        // 国外热门城市列表
        internationalHotList: [],
        searchCities:[],
        isLoading:false,
      };
    }

    render() {
      const {isLoading} = this.state;
      return (
        <LinearGradient colors={['#464e96', '#547ea9', '#409aaf']} style={{
          flex: 1,
        }}>
          <View style={{
            flex: 1,
            marginTop: STATUS_BAR_HEIGHT + APP_BAR_HEIGHT,
          }}>
            <View style={{
              width: SCREEN_WIDTH,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
            }}>
              <TextInput
                style={{
                  width: SCREEN_WIDTH - 2 * 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 8,
                  borderWidth: 0.5,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 8,
                  paddingRight: 8,
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: 20,
                }}
                onSubmitEditing={(event) => {
                  const cityName = event.nativeEvent.text;
                  this._searchArea(cityName);
                }}
                titleTextColor={'white'}
                placeholder={'please input city name'}
                placeholderTextColor={'rgba(255, 255, 255, 0.3)'}
                selectionColor={'rgba(255, 255, 255, 0.6)'}
                underlineColorAndroid={'transparent'}
                numberOfLines={1}/>
            </View>
            {this._renderHotCityList()}
          </View>
          <Loading isLoading={isLoading}></Loading>
        </LinearGradient>
      );
    }

    _searchAreaBycoord = (coord) => {
      this.setState({isLoading:true})
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${checkEmpty(coord,'Latitude')}&lon=${checkEmpty(coord,'Longitude')}&appid=${Constants.weather_api_key}`;
      Timeout(fetch(url)).then((response) => {
        this.setState({isLoading:false})
        if (response.ok) {
          return response.json();
        }
      }).then((jsonData) => {
        console.log(jsonData);
        // alert(JSON.stringify(jsonData))
        if (jsonData && jsonData.name) {
          console.log(jsonData.sys.country);
          let country = jsonData.sys && jsonData.sys.country;

          CityListManager.addCity(jsonData.cityid, country, jsonData.name,
            jsonData.prov, -1, -1, -1, null, -1, false, (cityList) => {
              const {goBack, state} = this.state.navigation;
              eventProxy.trigger('loadWeather');
              goBack();
              state.params.callBack(true, cityList);
              // requestAnimationFrame(() => {
              // });
            });
        } else {
          ToastUtils.show('error city name');
        }
      }).catch((error) => {
        this.setState({isLoading:false})
        ToastUtils.show(error.toString());
      });
    }

    _searchArea = (cityName) => {

      // const searchCityUrl = `http://zhwnlapi.etouch.cn/Ecalender/api/city?lon=&app_ts=1502957830998&app_key=99817749&foreign=true&device_id=29c82fbe10331817eb2ba134d575d541&ver_name=6.9.6&ver_code=716&uid=&keyword=${cityName}&channel=own&auth_token=eyJhY2N0ayI6IiIsInVwIjoiQU5EUk9JRCIsImRldmljZSI6IlNNLUc5NTUwMzUyNTYyMDc3MjY0MzM0In0%3D&lat=&type=search&devid=a47cc0669be48a6b49aba18d1c42e200&os_version=70`;
      const here_url = `https://geocoder.api.here.com/6.2/geocode.json?app_id=bimf9EtjbGUigGfufA1V&app_code=QjfZeEZBqkm_cblG96ouqw&searchtext=${cityName}`
      // const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${Constants.weather_api_key}`;
      // const url = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&type=like&sort=population&cnt=50&appid=${Constants.weather_api_key}`;
      Timeout(fetch(here_url)).then((response) => {
        if (response.ok) {
          return response.json();
        }
      }).then((jsonData) => {
        console.log(jsonData);
        this.setState({
          searchCities:checkEmpty(checkEmpty(jsonData,'Response','View')[0],'Result')|| [],
        })
        // alert(JSON.stringify(jsonData))

        // if (jsonData && jsonData.name) {
        //   console.log(jsonData.sys.country);
        //   let country = jsonData.sys && jsonData.sys.country;

        //   CityListManager.addCity(jsonData.cityid, country, jsonData.name,
        //     jsonData.prov, -1, -1, -1, null, -1, false, (cityList) => {
        //       const {goBack, state} = this.state.navigation;
        //       eventProxy.trigger('loadWeather');
        //       goBack();
        //       state.params.callBack(true, cityList);
        //       // requestAnimationFrame(() => {
        //       // });
        //     });


        // } else {
        //   ToastUtils.show('error city name');
        // }
      }).catch((error) => {
        ToastUtils.show(error.toString());
      });

    }

    _renderHotCityList = () => {
      // const nationalHotList = this.state.nationalHotList;
      // const internationalHotList = this.state.internationalHotList;
      // if ((!nationalHotList || nationalHotList.length <= 0) ||
      //       (!internationalHotList || internationalHotList.length <= 0)) {
      //   return (
      //     <View style={{
      //       flex: 1, justifyContent: 'center', alignItems: 'center',
      //     }}>
      //       <ActivityIndicator size="large" color="#fff"/>
      //     </View>
      //   );
      // }
      const {height, width} = Dimensions.get('window');
      return (
        <ScrollView
          style={{flex: 1}}
          overScrollMode={'never'}>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            width: SCREEN_WIDTH,
            height: 32,
            lineHeight: 32,
            textAlign: 'center',
            fontSize:28,
            fontWeight:'bold'
          }}>search results</Text>
          {this.state.searchCities.map((item,idx)=>{
            return(
              <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>{
              this._searchAreaBycoord(checkEmpty(item,'Location','DisplayPosition'))
            }}
            key={idx}>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 14,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 12,
                paddingRight: 12,
                margin: 6,
              }}>{`${item.Location.Address.Label}`}</Text>
          </TouchableOpacity>
            )

          })}
          {/* <Text 
          numberOfLines={10}
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            width,
            fontSize:18,
            fontWeight:'bold',
            paddingLeft:10,
            paddingRight:10,
          }}>Search engine is very flexible. How it works:</Text>
          <Text 
          numberOfLines={10}
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            width,
            fontSize:14,
            paddingLeft:10,
            paddingRight:10,
          }}>To make it more precise put the city's name, comma, 2-letter country code (ISO3166). You will get all proper cities in chosen country.
          The order is important - the first is city name then comma then country. Example - London, GB or New York, US.
          </Text> */}
          
        </ScrollView>
      );
    };

    

    componentDidMount() {
      // this.getHotCityList();
      this.props.navigation.setParams({
        headerRight: this._renderHeaderRight(),
      });
    }

    _systemSetting = () => {
      this.props.navigation.navigate('CityManager', {
        callBack: (haveDelete, cityList) => {
          // if (haveDelete) {
          //     this.props.refreshMainPage && this.props.refreshMainPage(cityList);
          // }
        },
      });
    };
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

    
}
