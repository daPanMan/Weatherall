/*
 * 登录
 */

import React, { Component, Fragment } from 'react';
import {View, Text, StyleSheet, TextInput, AsyncStorage} from 'react-native';
import { Button } from 'react-native-elements';
import Constants from '../../config/Constants';
import ToastUtils from '../../utils/ToastUtils';
import Timeout from '../../utils/Timeout';
import Loading from '../../components/Loading';
import pxToDp from '../../utils/pxToDp';


// const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
// const APP_BAR_HEIGHT = Utils.getAppBarHeight();
// const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class SignInScreen extends Component {
    static navigationOptions = {
      header: null,
    };


    email = '';
    password = '';

    constructor(props) {
      super(props);
      this.state = {
        message: '',
        isLoading:false,
      };
    }

    _cleanStorage = () => {

    };
    doLogin() {
      if (!this.email) {
        this.setState({
          'message':'email address',
        });
        return;
      }
      if (!this.password) {
        this.setState({
          'message':'login password',
        });
        return;
      }
      this.setState({
        isLoading:true,
      });
      Timeout(fetch(`${Constants.hostPrefix}/signin`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:this.email,
          password:this.password,
        }), 
      })).then((response) => {
        this.setState({
          isLoading:false,
        });
        if (response.ok) {
          return response.json();
        }
      }).then((jsonData) => {
        if (jsonData && jsonData.success) {
          this._signInAsync(jsonData.user);
          this.props.navigation.navigate('App');
                
        } else {
          this.setState({
            'message':jsonData.message,
          });
        }
            
      }).catch((error) => {
        this.setState({
          isLoading:false,
        });
        ToastUtils.show(error.toString());
      });
        
    }
    doReg() {
      this.props.navigation.navigate('Reg');
    }

    findAccount() {
      this.props.navigation.navigate('FindAccount');
    }
   



    render() {
      let message = this.state && this.state.message ? this.state.message : '';
      let isLoading = this.state.isLoading;
      return (
        <View style={styles.loginPage}>
          <View style={styles.loginSection}>
            <Text style={styles.loginTitle}>WeatherAll</Text>
            <TextInput style={styles.loginInput} placeholder="email"
              autoCapitalize={'none'}
              onChangeText={(text) => this.email = text}/>
            <TextInput style={styles.loginInput} placeholder="password" secureTextEntry={true}
              autoCapitalize={'none'}
              onChangeText={(text) => this.password = text}/>
            <Button  title={'Login'} onPress={() => this.doLogin()}/>
            <View style={styles.subButton}>
              <Text style={styles.subButtonText} onPress={() => this.doReg()}>No account? Create one!</Text>
              <Text style={styles.subButtonText} onPress={() => this.findAccount()}>Forgot password</Text>
            </View>
            <Text style={styles.message}>{message}</Text>
          </View>
          <Loading isLoading={isLoading}></Loading>
        </View>
      );
    }
    _signInAsync = async (user) => {
      await AsyncStorage.setItem('userToken', user);
    };



}

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loginSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: '#56688a',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  subButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  subButtonText: {
    color: '#8c8c8c',
    fontSize: 14,
  },
  loginInput: {
    marginBottom: pxToDp(50),
    borderColor:'#cccccc',
    borderWidth:1,
    fontSize:pxToDp(40),
  },
  message: {
    marginTop: 16,
    color: '#ca0814',
    fontSize: 14,
  },
});
