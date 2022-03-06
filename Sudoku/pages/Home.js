import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, Button, Picker, Form, TouchableOpacity, Image } from 'react-native';

export default function Home({navigation}) {
    const [name, setName] = useState('')
    const [difficulty, setDifficulty] = useState('easy')

    function handleName(text) {
        setName(text)
    }

    function handleDifficulty(value) {
        setDifficulty(value)
    }

    function handleSubmit() {
        if(name && difficulty) {
          navigation.navigate('GameScreen', {
            name,
            difficulty
          })
          setName('')
        } else {
          alert('name and difficulty level cannot be empty')
        }
    }

    return (
        <View style={styles.container}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Sign In</Text>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Name"
            placeholderTextColor = "#ffffff"
            selectionColor="#fff"
            onChangeText={handleName}
            value={name}
          />
          <Picker selectedValue={difficulty}
            style={styles.inputBox}
            onValueChange={handleDifficulty}
            value={difficulty}>
            <Picker.Item label="easy" value="easy"/>
            <Picker.Item label="medium" value="medium"/>
            <Picker.Item label="hard" value="hard"/>
          </Picker>
          <View style={{marginTop: 15}}>
            <Button title="Login" onPress={handleSubmit} style={styles.button}/>
          </View>
        </View>
        );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'oldlace',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40
  },
  box: {
    height: 35, 
    width: 35, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    borderColor: 'black', 
    borderWidth: 1
  },
  inputBox: {
    width:300,
    backgroundColor: 'powderblue',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
    },
  button: {
    width:300,
    backgroundColor:'blue',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
    },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
    }
});