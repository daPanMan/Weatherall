import {Dimensions} from 'react-native';

export default {
  common_param: {
    PAGE_SIZE: 20,
    SCREEN_WIDTH: Dimensions.get('window').width,
    SCREEN_HEIGHT: Dimensions.get('window').height,
  },

  permission_tips: {
    REQUEST_PERMISSION_SUCCESS: 'request permission success',
    REQUEST_PERMISSION_FAILURE: 'request permission failure',
  },

  load_more_flag: {
    /*正在加载*/
    LOADING: 0,
    /*加载完成*/
    LOADING_COMPLETE: 1,
    /*加载完成没有更多数据*/
    LOADING_COMPLETE_NO_DATA: 2,
    LOADING_FAIL: 3,
  },

  city_list: 'city_list',
  max_weather_city_number: 10,
  add_city_error: "You can't add a city multiple times",
  add_city_fill: 'You can only add up to 10 cities',

  tencent_location_api: {
    APP_KEY: 'E4DBZ-MKZW3-QSC3L-YNQNK-IQI3K-ERBDW',
  },
  // hostPrefix:'http://192.168.1.101:3000',
  hostPrefix:'http://47.88.7.37:3000',  // aliyun
  weather_api_key:'20f4ca4523f4a389a39dd228a1dbea07', //https://home.openweathermap.org/api_keys
  alerms_api_key:'SIpb5RsuN8umibEnN', //https://www.seniverse.com

  //https://developer.here.com/documentation/geocoder/topics/example-geocoding-free-form.html
  // https://developer.here.com/projects/PROD-cea0f6c0-556f-4215-ac78-bdb869544c68
  js_here_key:'pOE0hGExyyJAjROW8iC4sv1ruGHZLZVSzeCKaeEtrRE',//https://developer.here.com/products/geocoding-and-search
  js_here_appid:'7aO4XRwVkafsk51XRqWa',//https://developer.here.com/products/geocoding-and-search
  rest_here_appid:'bimf9EtjbGUigGfufA1V',
  rest_here_appcode:'QjfZeEZBqkm_cblG96ouqw',
};
