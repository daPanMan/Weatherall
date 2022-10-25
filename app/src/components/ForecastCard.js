import React, {Component} from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback,AsyncStorage } from 'react-native';
import { Text, Card, Divider } from 'react-native-elements';
import eventProxy from '../utils/eventProxy';

export default class ForecastCard extends Component {
  constructor(props){
    super(props)
    this.state={
      unitF:false,
    }

  }

   getUnitF=async()=>{
    let unitF = await AsyncStorage.getItem('unitF');
    return unitF;
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

  render() {
    let time;

    // Create a new date from the passed date time
    var date = new Date(this.props.detail.dt * 1000);

    // Hours part from the timestamp
    var hours = date.getHours();
		
    // Minutes part from the timestamp
    var minutes = '0' + date.getMinutes();

    time = hours + ':' + minutes.substr(-2);
    
    let temp = Math.round( this.props.detail.main.temp * 10) / 10;
    let tempF = Math.round(1.8* temp *10)/10 +32;
    // console.log(this.state.unitF)

    return (
      <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
        <Card containerStyle={styles.card} wrapperStyle={{flexDirection:'row'}}>
          <View style={{flex:2}}>

            <Image style={{width:80, height:80}} source={{uri:'https://openweathermap.org/img/w/' + this.props.detail.weather[0].icon + '.png'}} />
            <Text style={styles.notes}>{this.props.detail.weather[0].description}</Text>
          </View>

          <View style={{flex:3, flexDirection:'column', justifyContent: 'space-between'}}>
            {this.state.unitF?(
              <Text style={styles.temp}>{tempF}&#176;F</Text>
            ):(
              <Text style={styles.temp}>{temp}&#8451;</Text>
            )}
            
            <Text style={styles.notes}>{this.props.location}</Text>
          </View>
          {/* <Text style={styles.notes}>{this.props.location}</Text>
					
					<View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
						<Image style={{width:100, height:100}} source={{uri:'https://openweathermap.org/img/w/' + this.props.detail.weather[0].icon + '.png'}} />
						<Text style={styles.time}>{this.props.detail.dt_txt}</Text>
					</View>

					<Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
					
					<View style={{flexDirection:'row', justifyContent:'space-between'}}>
						<Text style={styles.notes}>{this.props.detail.weather[0].description}</Text>
						<Text style={styles.notes}>{Math.round( this.props.detail.main.temp * 10) / 10 }&#8451;</Text>
					</View> */}
        </Card>
      </TouchableWithoutFeedback>
			
    );
  }
}

const styles = StyleSheet.create({
  card:{
    backgroundColor:'rgba(56, 172, 236, 1)',
    borderWidth:0,
    borderRadius:20,
		
  },
  time:{
    fontSize:14,
    color:'#fff',
  },
  temp:{
    fontSize: 50,
    color:'#fff',
    textTransform:'capitalize',
    textAlign:'center',
  },
  notes: {
    fontSize: 18,
    color:'#fff',
    textTransform:'capitalize',
  },
});