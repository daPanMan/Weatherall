import {
  createStackNavigator, createSwitchNavigator,
} from 'react-navigation';
import SelectCityPage from './app/src/screens/city/SelectCityPage';
import CityManagerPage from './app/src/screens/city/CityManagerPage';
import MainPage from './app/src/screens/main';
import SettingsPage from './app/src/screens/settings';
import DetailPage from './app/src/screens/detail';
import SignInScreen from './app/src/screens/signInScreen';
import AuthLoadingScreen from './app/src/screens/authLoadingScreen';

import FindAccountPage from './app/src/screens/findAccountPage';
import RegPage from './app/src/screens/regPage';
import RadarPage from './app/src/screens/radar';
import Feedback from './app/src/screens/feedback';

import Utils from './app/src/utils/Utils';

const AppStack = createStackNavigator({
  Main: {
    screen: MainPage,
  },
  SelectCity: {
    screen: SelectCityPage,
  },
  CityManager: {
    screen: CityManagerPage,
  },
  Settings: {
    screen: SettingsPage,
  },
  Detail:{
    screen:DetailPage,
  },
  RadarPage:{
    screen:RadarPage,
  },
  Feedback:{
    screen:Feedback,
  },
}, {
  headerTintColor: 'white',
  headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
  headerMode: Utils.isAndroid() ? 'screen' : 'float',
  mode: 'card',
});
const LoginStack = createStackNavigator({ 
  SignIn: {
    screen:SignInScreen,
  },
  Reg: {
    screen: RegPage,
  }, // 注册页
  FindAccount: {
    screen: FindAccountPage,
  }, // 找回密码页
});
export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,       // main page
    Auth: LoginStack,   // login page
  },
  {
    initialRouteName: 'AuthLoading',
  }
);