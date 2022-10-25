import React, {Component} from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Card, Divider } from 'react-native-elements';


export default class AlertsCard extends Component {

  render() {
    // console.log(this.props.item);
	
    return (
      <Card containerStyle={styles.card}>
        <Text style={styles.notes}>{this.props.item.title}</Text>
				
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={styles.time}>{this.props.item.description}</Text>
        </View>

        <Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
				
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.bottom}>{this.props.item.type}</Text>
          <Text style={styles.bottom}>{this.props.item.status}</Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card:{
    backgroundColor:'#FFFF00',
    borderWidth:0,
    borderRadius:20,
  },
  time:{
    fontSize:14,
    color:'#DC143C',
    marginTop: 16,
  },
  notes: {
    fontSize: 28,
    fontWeight: '500',
    color:'#DC143C',
    textTransform:'capitalize',
  },
  bottom: {
    fontSize: 18,
    fontWeight: '100',
    color:'#DC143C',
    textTransform:'capitalize',
  },
});