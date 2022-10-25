import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Dimensions } from 'react-native';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class Loading extends React.Component {
  constructor(props) {
    super(props);
        
  }
    static defaultProps = {
      isLoading: false,
    };  

    
    render() {
      if (!this.props.isLoading) {
        return null;
      }
      return (
        <View style={{
          flex : 1,
          width : width,
          height : height,
          position : 'absolute',
          // backgroundColor:'red',
          backgroundColor : '#10101099',
        }}>
          <View style={styles.loading}>
            <ActivityIndicator color="white"/>
            <Text style={styles.loadingTitle}>Loading...</Text>
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  loading : {
    backgroundColor : '#10101099',
    height : 80,
    width : 100,
    borderRadius : 10,
    justifyContent : 'center',
    alignItems : 'center',
    position : 'absolute',
    top : (height - 80) / 2,
    left : (width - 100) / 2,
  },

  loadingTitle : {
    marginTop : 10,
    fontSize : 14,
    color : 'white',
  },
});

