import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, StatusBar} from 'react-native';
import { Button } from 'react-native-elements';
import Constants from '../../config/Constants';
import Utils from '../../utils/Utils';
import ToastUtils from '../../utils/ToastUtils';
import Timeout from '../../utils/Timeout';
import Loading from '../../components/Loading';
import pxToDp from '../../utils/pxToDp';
const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export class FindAccountPage extends Component {
    static navigationOptions = {
      title: 'reset password',
      headerStyle: {
        height: APP_BAR_HEIGHT,
        backgroundColor: '#92a8d1',
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        marginStart: 0,
        fontSize: 18,
      },
      headerTintColor: 'white',
      headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
      headerTransparent: true,
    }
    email = '';
    code = '';
    password = '';
    password2 = '';
    timer;

    constructor(props) {
      super(props);
      this.state = {message: '', sendFlag: false, second: 30, isLoading:false};
    }

    componentWillUnmount() {
      this.timer && clearInterval(this.timer);
    }

    getCode() {
      if (!this.email) {
        this.updateState('message', 'email address');
        return;
      }
      if (this.state.sendFlag) {
        this.updateState('message', 'operation too frequent, please try again later');
        return;
      }

      this.setState({
        isLoading:true,
      });
      Timeout(fetch(`${Constants.hostPrefix}/signup/getCode`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:this.email,
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
          ToastUtils.show('code sent, please check your mailbox');
          this.updateState('message', 'the verification code is valid for 10 minutes');
          // 倒计时30s
          this.updateState('sendFlag', true);
          this.timer = setInterval(
            () => {
              if (this.state.second <= 0) {
                this.updateState('second', 0);
                this.updateState('sendFlag', false);
                this.timer && clearInterval(this.timer);
              } else {
                this.updateState('second', this.state.second - 1);
              }
            },
            1000
          );
                
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

    updateState(key, val) {
      let state = this.state;
      state[key] = val;
      this.setState(state);
    }

    doSubmit() {
      if (!this.email) {
        this.updateState('message', 'email address');
        return;
      }
      if (!this.password) {
        this.updateState('message', 'login password');
        return;
      }
      if (!this.password2) {
        this.updateState('message', 'confirm password');
        return;
      }
      if (this.password !== this.password2) {
        this.updateState('message', 'passwords do not match');
        return;
      }
      this.setState({
        isLoading:true,
      });
      Timeout(fetch(`${Constants.hostPrefix}/signup/updatePwd`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:this.email,
          password:this.password,
          code:this.code,
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
          ToastUtils.show('password reset success, please go back and log in');
          this.goBack();
                
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

    goBack() {
      this.props.navigation.goBack();
    }

    render() {
      let message = this.state && this.state.message ? this.state.message : '';
      let codeBtnText = this.state && this.state.sendFlag && this.state.second ? 'code sent' + this.state.second + 's' : 'get code';
      let codeBtnStyle = this.state && this.state.sendFlag ? styles.codeBtnDisabled : styles.codeBtn;
      let isLoading = this.state.isLoading;
      return (

        <View style={styles.regPage}>
          <TextInput style={styles.regInput} placeholder="email"
            autoCapitalize={'none'} 
            onChangeText={(text) => this.email = text}/>
          <View style={[styles.codeRow, styles.regInput]}>
            <TextInput style={{flex: 1}} placeholder="verification code" keyboardType={'numeric'}
              autoCapitalize={'none'}
              onChangeText={(text) => this.code = text}/>
            <Button disabled={this.state.sendFlag}
              style={codeBtnStyle} title={codeBtnText}
              onPress={() => this.getCode()}/>
          </View>
          <TextInput style={styles.regInput} placeholder="password" secureTextEntry={true}
            autoCapitalize={'none'} 
            onChangeText={(text) => this.password = text}/>
          <TextInput style={styles.regInput} placeholder="confirm password" secureTextEntry={true}
            autoCapitalize={'none'} 
            onChangeText={(text) => this.password2 = text}/>
          <Button style={styles.regInput} title={'reset password'} onPress={() => this.doSubmit()}/>
          <Text style={styles.message}>{message}</Text>
          <Loading isLoading={isLoading}></Loading>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  regPage: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#f5f5f5',
  },
  regInput: {
    marginBottom: 8,
        
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeBtn: {},
  codeBtnDisabled: {backgroundColor: '#8c8c8c'},
  message: {
    marginTop: 16,
    color: '#ca0814',
    fontSize: 14,
  },
});
export default FindAccountPage;