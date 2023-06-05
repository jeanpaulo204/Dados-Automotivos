import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { Input, Button, ListItem, Icon } from 'react-native-elements';
import { format } from 'date-fns';
import axios from 'axios';


     // Use o Axios para fazer requisições HTTP
     axios.post('http://192.168.100.43:3302/veiculos')
     .then(response => {
       // Manipule a resposta da requisição aqui
       console.log(response.data);
     })
     .catch(error => {
       // Manipule erros aqui
       console.error(error);
     });

const CrudExample = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [km, setKm] = useState('');
  const [gasolina, setGasolina] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showEditMessage, setShowEditMessage] = useState(false);

const handleAddItem = () => {
  if (km.trim() === '' || gasolina.trim() === '') {
    return;
  }

  if (editingItemId) {
    // ...
  } else {
    const newItem = {
      id: Date.now().toString(),
      date,
      km,
      gasolina,
    };

    axios.post('http://192.168.100.43:3302/veiculos', newItem)
      .then(response => {
        // Manipule a resposta da requisição aqui, se necessário
        console.log(response.data);
        setData([...data, newItem]);
      })
      .catch(error => {
        // Manipule erros aqui, se necessário
        console.error(error);
      });
  }

  setDate(new Date());
  setKm('');
  setGasolina('');
};

  const handleDeleteItem = (id) => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const newData = data.filter((item) => item.id !== id);
            setData(newData);
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false);
            }, 1000);
          },
        },
      ],
    );
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setDate(item.date);
    setKm(item.km);
    setGasolina(item.gasolina);
  };

  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy');
  };

   

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <ListItem.Content>
        <ListItem.Title>{formatDate(item.date)}</ListItem.Title>
        <ListItem.Subtitle>{item.km} KM</ListItem.Subtitle>
        <ListItem.Subtitle>{item.gasolina} Litros</ListItem.Subtitle>
      </ListItem.Content>
      <View style={styles.itemActions}>
        <Icon
          name="pencil"
          type="material-community"
          color="#9e9e9e"
          onPress={() => handleEditItem(item)}
        />
        <Icon
          name="delete"
          type="material"
          color="#ff5252"
          onPress={() => handleDeleteItem(item.id)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name="car" type="font-awesome" size={40} color="#fff" />
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Data"
          placeholder="Digite a data"
          value={formatDate(date)}
          editable={false}
        />
        <Input
          label="Quantos KM?"
          placeholder="Digite a quantidade de KM"
          keyboardType="numeric"
          value={km}
          onChangeText={(text) => setKm(text)}
        />
        <Input
          label="Gasolina (Litros)"
          placeholder="Digite a quantidade de gasolina"
          keyboardType="numeric"
          value={gasolina}
          onChangeText={(text) => setGasolina(text)}
        />
        <Button
          title={editingItemId ? 'Salvar' : 'Adicionar'}
          onPress={handleAddItem}
          disabled={km.trim() === '' || gasolina.trim() === ''}
          buttonStyle={styles.addButton}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {showMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Foi excluído com sucesso!</Text>
        </View>
      )}

      {showEditMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Foi editado com sucesso!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00bcd4',
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#ff9800',
  },
  listContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemActions: {
    flexDirection: 'row',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#51B449',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  messageText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CrudExample;