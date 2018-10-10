import React, { Component } from 'react';
import { Alert, View, TextInput, Picker, Button, Image, Text } from 'react-native';

let x = 0;
let y = '0';
let imgs = [];
let szukaj_text = 'Szukaj';
let wylaczony = false;

class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {type: '0', number: '1'};
    this.numberChange = this.props.numberChange.bind(this);
    this.typeChange = this.props.typeChange.bind(this);
    this.goSearch = this.props.goSearch.bind(this);
  }

  render() {
    return (
      <View style={{flex: 1, top: 40}}>
        <TextInput
          style={{height: 40}}
          placeholder="Ilość zdjęć [1-10]"
          keyboardType = 'numeric'
          onChangeText={(text) => {this.numberChange({text});}}
        />
        <Picker
          selectedValue={this.state.type}
          style={{ height: 50, width: 200 }}
          //onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}
          onValueChange={(itemValue, itemIndex) => {this.typeChange(itemValue); this.setState({type: itemValue});}}>
          <Picker.Item label="Shibes" value="0" />
          <Picker.Item label="Cats" value="1" />
          <Picker.Item label="Birds" value="2" />
          <Picker.Item label="Random" value="3" />
        </Picker>
        <Button
          onPress={() => this.goSearch()}
          title={szukaj_text}
          disabled={wylaczony}
        />
      </View>
    );
  }
}

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { type: '0', number: '1'};
    this.numberChange = this.numberChange.bind(this);
    this.typeChange = this.typeChange.bind(this);

    setInterval(() => {this.forceUpdate();}, 200);
  }

  numberChange(event){
    if(event.text == ''){
      x = 0;
      return;
    }
    let numb = parseInt(event.text);
    this.setState({number: event.text});
    x = numb;
  }

  typeChange(itemValue){
    this.setState({type: itemValue});
    y = itemValue;
  }

  goSearch(){
    if(x == 0 || x < 1 || x > 10){
      Alert.alert('Podaj liczbę z przedziału [1-10].');
      return;
    }

    szukaj_text = 'Ładowanie danych';
    wylaczony = true;

    let link = {
      0: 'http://shibe.online/api/shibes?count=' + x,
      1: 'http://shibe.online/api/cats?count=' + x,
      2: 'http://shibe.online/api/birds?count=' + x
    };

    let numb = parseInt(y);
    if(y == '3'){
      numb = Math.round(Math.random() * 2);
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        imgs = [];
        
        let data = JSON.parse(request.responseText);

        for(let i = 0; i < x; i++){
          imgs.push({uri: data[i]});
        }

        szukaj_text = 'Szukaj';
        wylaczony = false;

      } else {
        Alert.alert('Błąd w czasie łączenia z serwerem.');
      }
    };

    request.open('GET', link[numb]);
    request.send();

  }

  render() {

    let images = imgs.map((src) => {
        return <Image source={src} style={{width: 50, height: 50}}/>                            
      });

    return (  
      <View style={{flex: 1}} onPress = {() => {this.forceUpdate();}}>
        <View style={{flex: 1, backgroundColor: 'grey'}}>
          <Form onChange={this.numberChange} numberChange={this.numberChange} typeChange={this.typeChange} goSearch={this.goSearch}/>
        </View>
        <View style={{flex: 3, backgroundColor: 'white'}}>
          {images}
        </View>
      </View>
    );
  }
}
