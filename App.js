import { AppLoading } from 'expo';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Modal, Pressable, TextInput } from 'react-native';


export default function App() {
  const image = require('./resources/bg.jpg');
  const [modal, setModal] = useState(false);
  const [tarefas, setTarefas] = useState([]);
  const [tarefaNova, setTarefaNova] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let tarefaAtual = await AsyncStorage.getItem('tarefas');
        if (tarefaAtual == null) {
          setTarefas([]);
        } else {
          setTarefas(JSON.parse(tarefaAtual));
        }
      } catch (error) {
        // Error saving data
      }
    })();
  }, []);


  function deletarTarefa(id) {
    let novasTarefas = tarefas.filter(function (val) {
      return val.id != id;
    });

    setTarefas(novasTarefas);

    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
      } catch (error) {
      }
    })();
  }

  function addTarefa() {
    setModal(!modal);
    let id = 0;
    if (tarefas.length > 0) {
      id = tarefas[tarefas.length - 1].id + 1;
    }
    let tarefa = { id: id, tarefa: tarefaNova };
    setTarefas([...tarefas, tarefa]);

    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas, tarefa]));
      } catch (error) {
        // Error saving data
      }
    })();
  }


  return (
    <ScrollView style={styles.container}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={styles.modalText} autoFocus={true} onChangeText={text => setTarefaNova(text)}></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => addTarefa()}>
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.coverView}><Text style={styles.text}>Lista de tarefa</Text></View>
      </ImageBackground>


      {
        tarefas.map((item, index) => (
          <View key={index} style={styles.tarefaSingle}>
            <View style={styles.textoTarefa}>
              <Text>{item.tarefa}</Text>
            </View>
            <View style={styles.btnMenos}>
              <TouchableOpacity onPress={() => deletarTarefa(item.id)}>
                <AntDesign name="minuscircle" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      }

      <TouchableOpacity style={styles.btnFlutuante} onPress={() => setModal(true)}><AntDesign name="pluscircle" size={60} color="black" /></TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#edebeb'
  },
  image: {
    width: '100%',
    height: 80,
  },
  coverView: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  tarefaSingle: {
    marginTop: 30,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    paddingBottom: 10
  },
  textoTarefa: {
    flex: 1,
    width: '100%',
    padding: 10
  },
  btnMenos: {
    alignItems: 'flex-end',
    flex: 1,
    padding: 10
  },

  // Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  btnFlutuante: {
    padding: 8,
    marginTop: 20
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  }

});
