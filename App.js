import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Input, Button, ListItem, Icon } from 'react-native-elements';
import { format } from 'date-fns';

const CrudExample = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [km, setKm] = useState('');
  const [gasolina, setGasolina] = useState('');

  const handleAddItem = () => {
    if (km.trim() === '' || gasolina.trim() === '') {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      date,
      km,
      gasolina,
    };

    setData([...data, newItem]);
    setDate(new Date());
    setKm('');
    setGasolina('');
  };

  const handleDeleteItem = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
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
      <Icon
        name="delete"
        type="material"
        color="#ff5252"
        onPress={() => handleDeleteItem(item.id)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
          title="Adicionar"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 80,
    paddingHorizontal: 16,
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
});

export default CrudExample;
