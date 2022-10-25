import CityListManager from '../manager/CityListManager';
import ToastUtils from './ToastUtils';
import Constants from '../config/Constants';
import Timeout from './Timeout';
/**
     * 成功获取定位权限
     */
function locationPermissionRequestSuccess(setCurrentTabIndex, forceLocation, refreshThisPage, setLoadingFalse) {
  CityListManager.getCityList((cityList) => {
    if (cityList && cityList.length > 0 && !forceLocation) {
      // currentTabIndex = 0;
      // this.setState({
      //     requestLocation: false,
      //     cityList: cityList,
      // });
      setCurrentTabIndex && setCurrentTabIndex(cityList);
                
    } else {
      navigator.geolocation.getCurrentPosition(
        location => {
          // 纬度
          const latitude = location.coords.latitude;
          // 经度
          const longitude = location.coords.longitude;
          getWeather(latitude, longitude, refreshThisPage, setLoadingFalse);
        },
        error => {
          ToastUtils.show(error);
        }
      );
    }
  });
}

/**
     * 使用openweathermap 获得天气
     * @param latitude 纬度      31.936546
     * @param longitude 经度    118.814264
     * 
     * https://api.openweathermap.org/data/2.5/weather?lat=31.936546&lon=118.741088&units=metric&appid=2892588a1c27d07760a454ed0e2ada83
     */
function getWeather(latitude, longitude, refreshThisPage, setLoadingFalse) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=31.936546&lon=118.741088&units=metric&appid=${Constants.weather_api_key}`;
  Timeout(fetch(url)).then((response) => {
    if (response.ok) {
      return response.json();
    }
  }).then((jsonData) => {
    // locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse);
    setLoadingFalse && setLoadingFalse();
    console.log(jsonData);
    return jsonData;
  }).catch((error) => {
    console.log(error);
    ToastUtils.show(error.toString());
  });

}

/**
     * 使用腾讯定位api定位
     * @param latitude 纬度
     * @param longitude 经度
     */
function tencentLocationRequest(latitude, longitude, refreshThisPage, setLoadingFalse) {
  const url = 'https://apis.map.qq.com/ws/geocoder/v1/?location='
            + latitude + ',' + longitude + '&key=' + Constants.tencent_location_api.APP_KEY;
  Timeout(fetch(url)).then((response) => {
    if (response.ok) {
      return response.json();
    }
  }).then((jsonData) => {
    locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse);
  }).catch((error) => {
    ToastUtils.show(error.toString());
  });
}

/**
     * 调用 zhwnlapi 定位省市区
     */
function locationRequestSuccess(jsonData, refreshThisPage, setLoadingFalse)  {
  if (jsonData) {
    const address = jsonData.result.address_component;
    let locationCity = address.city;
    let locationProvince = address.province;
    let locationDistrict = address.district;
    const searchCityUrl = 'http://zhwnlapi.etouch.cn/Ecalender/api/city?lon=&app_ts=1502957830998&app_key=99817749&foreign=true&device_id=29c82fbe10331817eb2ba134d575d541&ver_name=6.9.6&ver_code=716&uid=&keyword=' +
                address.district + '&channel=own&auth_token=eyJhY2N0ayI6IiIsInVwIjoiQU5EUk9JRCIsImRldmljZSI6IlNNLUc5NTUwMzUyNTYyMDc3MjY0MzM0In0%3D&lat=&type=search&devid=a47cc0669be48a6b49aba18d1c42e200&os_version=70';
    Timeout(fetch(searchCityUrl)).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((result) => {
      const results = result.data;
      if (results && results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          const resultBean = results[i];
          if (resultBean.prov.indexOf(locationProvince) !== -1
                            || locationProvince.indexOf(resultBean.prov) !== -1) {
            // 省份校验通过
            if (resultBean.upper.indexOf(locationCity) !== -1
                                || locationCity.indexOf(resultBean.upper) !== -1) {
              // 城市校验通过
              if (resultBean.name.indexOf(locationDistrict) !== -1
                                    || locationDistrict.indexOf(resultBean.name) !== -1) {
                // 区域校验通过
                CityListManager.addCity(resultBean.cityid, resultBean.upper,
                  resultBean.name, resultBean.prov, -1, -1, -1, null, -1, true, (cityList) => {
                    // this.refreshThisPage(cityList);
                    refreshThisPage && refreshThisPage(cityList);
                  });
                break;
              }
            }
          }
        }
      }
      // this.setState({ requestLocation: false });
      setLoadingFalse && setLoadingFalse();
    }).catch((error) => {
      ToastUtils.show(error.toString());
    });
  }
}

export {
  locationPermissionRequestSuccess,
  tencentLocationRequest,
  locationRequestSuccess,
};