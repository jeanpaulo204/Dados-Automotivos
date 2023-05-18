import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Input, Button, ListItem, Icon } from 'react-native-elements';

const CrudExample = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddItem = () => {
    if (name.trim() === '' || email.trim() === '') {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      email,
    };

    setData([...data, newItem]);
    setName('');
    setEmail('');
  };

  const handleDeleteItem = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
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
          label="Nome"
          placeholder="Digite o nome"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          label="Email"
          placeholder="Digite o email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Button
          title="Adicionar"
          onPress={handleAddItem}
          disabled={name.trim() === '' || email.trim() === ''}
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
