import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, Button, Dimensions, Alert } from 'react-native';
import {useSelector, useDispatch} from 'react-redux'
import {fetchBoard, validateBoard, win, solveBoard} from '../store/actions'
import { AsyncStorage } from 'react-native';

export default function Game({navigation, route}) {
  const [newBoard, setNewBoard] = useState([])
  const status = useSelector(state => state.stateStatus)
  const dispatch = useDispatch()
  const board = useSelector(state => state.stateBoard)
  const [timeDisplay, setTimeDisplay] = useState('')
  const [seconds, setSeconds] = React.useState(300);
  const { name, difficulty } = route.params
  const loading = useSelector(state => state.stateLoading)

  useEffect(() => {
    dispatch(fetchBoard(difficulty))
  }, [])

  useEffect(() => {
    setNewBoard(board)
  }, [board])

  useEffect(() => {
    if(status !== 'solved') {
      if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
        let minute = Math.floor(seconds/60)
        let second = seconds % 60
        if(second < 10) {
          second = `0${second}`
        }
        setTimeDisplay(`0${minute}:${second}`)
      } else {
        navigation.navigate('FinishScreen', {
          name
        })
      }
    }
  })

  if(!loading) {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>page is loading..</Text>
      </View>
    )
  }

  if(status == 'solved') {
    let lapse = 300 - seconds
    let minute = Math.floor(lapse/60)
    let second = lapse % 60
    if(second < 10) {
      second = `0${second}`
    }
    let currentTime = `0${minute}:${second}`
    let payload = {
      name,
      time: seconds, 
      timeDisplay: currentTime
    }
    win(payload)
    navigation.navigate('FinishScreen', {
      name
    })
  }

  function handleInput(row, col, text) {
    console.log(row, col, text)
    let clone = JSON.parse(JSON.stringify(newBoard))
    clone[row].splice(col, 1, text * 1)
    setNewBoard(clone)
  }

  function validate() {
    console.log(newBoard)
    let payload = {
        board: newBoard
    }
    dispatch(validateBoard(payload))
  }

  function solve() {
    console.log(newBoard)
    let payload = {
      board: newBoard
    }
    const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')   
    const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

    fetch('https://sugoku.herokuapp.com/solve', {
        method: 'POST',
        body: encodeParams(payload),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => response.json())
        .then(response => {
            console.log(response.solution)
            setNewBoard(response.solution)
        })
        .catch(console.warn)
  }

  async function win(payload) {
    let arr = [payload.name, payload.time, payload.timeDisplay]
    let container = []

    try {
      const myArray = await AsyncStorage.getItem('@MySuperStore:key');
      if (myArray !== null) {
          container = JSON.parse(myArray)
      }
    } catch (err) {
        console.log(err)
    }

    container.push(arr)

    try {
        await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(container));
    } catch (err) {
        console.log(err)
    }
  }

  return (
      <View style={styles.container}>
        <Text style={{fontSize: 20}}>Sudoku challenge</Text>
        <Text>name: {name}</Text>
        <Text>level: {difficulty}</Text>
        <Text style={{marginBottom: 15, fontSize: 50, color: 'red'}}>{timeDisplay}</Text>
        <View style={{marginBottom: 15}}>
          {newBoard.map((row, r) => {
            return (
              <View key={r} style={{flexDirection: 'row'}}>
                {row.map((column, c) => {
                  return (
                    <View key={c} style={styles.box}>
                      <TextInput onChangeText={(input) => {handleInput(r, c, input)}} 
                        // style={{fontSize: 20}} 
                        style={board[r][c] ? {backgroundColor: 'gray', fontSize: 20} : {fontSize: 20}}
                        editable={board[r][c] ? false : true}
                        textAlign={'center'}
                        keyboardType="numeric"
                        maxLength={1}
                        value={column ? column.toString() : null}>
                      </TextInput>
                    </View>
                    )
                })}
              </View>
              )
          })}
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <View style={{ marginRight: 15 }}><Button onPress={validate} title="Validate"/></View>
          <View><Button onPress={solve} title="Solve"/></View>
        </View>
        
        <Text>{status}</Text>
      </View>
  );
}

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'oldlace',
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    backgroundColor: 'mintcream', 
    justifyContent: 'center', 
    borderColor: 'black', 
    borderWidth: 1,
    width: windowWidth/10,
    height: windowWidth/10
  }
});