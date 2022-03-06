import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, Button, Picker, ScrollView } from 'react-native';
import {useSelector, useDispatch} from 'react-redux'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {reset} from '../store/actions'
import { AsyncStorage } from 'react-native';

export default function Finish({navigation, route}) {
    const dispatch = useDispatch()
    const status = useSelector(state => state.stateStatus)
    const [tableHead, setTableHead] = useState(['Rank', 'Name', 'Time'])
    const [tableData, setTableData] = useState([])
    const { name } = route.params

    useEffect(() => {
        fetchWinners()
        if(status == 'solved') {
            alert('you have solved the problem!')
        }
    }, [])

    const fetchWinners = async() => {
        try {
            const myArray = await AsyncStorage.getItem('@MySuperStore:key');
            if (myArray !== null) {
                let result = JSON.parse(myArray)
                result.sort(function(a, b) {
                    return b[1] - a[1];
                });
                let container = []
                for (let i = 0; i < result.length; i++) {
                    container.push([i + 1, result[i][0], result[i][2]])
                }
                setTableData(container)
            }
        } catch (err) {
            console.log(err)
        }
    }

    function Home() {
        dispatch(reset())
        navigation.navigate('HomeScreen')
    }

    return (
        <View style={styles.container}>
            {status == 'solved' ? <Text style={{textAlign: 'center', fontSize: 25, color: 'red', fontWeight: 'bold'}}>{name}, you won!</Text> : <Text>You lost!</Text>}
            <Text style={{marginTop: 15, fontSize: 13, fontWeight: 'bold'}}>Current leader board:</Text>
            <ScrollView style={{marginBottom: 25}}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    <Rows data={tableData} textStyle={styles.text}/>
                </Table>
            </ScrollView>
            <Button title="Home" onPress={Home}/>
        </View>
        );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: 'mintcream' },
    head: { height: 40, backgroundColor: '#f1f8ff'},
    text: { margin: 6, textAlign: 'center', fontSize: 15 }
});