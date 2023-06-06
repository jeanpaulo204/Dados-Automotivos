import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { Input, Button, ListItem, Icon } from 'react-native-elements';
import { format } from 'date-fns';
import axios from 'axios';

const ExemploCrud = () => {
  const [dados, setDados] = useState([]);
  const [data, setData] = useState(new Date());
  const [km, setKm] = useState('');
  const [gasolina, setGasolina] = useState('');
  const [itemIdEditando, setItemIdEditando] = useState(null);
  const [exibirMensagem, setExibirMensagem] = useState(false);
  const [exibirMensagemEdicao, setExibirMensagemEdicao] = useState(false);
  const [exibirMensagemExclusao, setExibirMensagemExclusao] = useState(false);
  const refLista = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.100.43:3302/veiculos');
      setDados(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const adicionarItem = () => {
    if (km.trim() === '' || gasolina.trim() === '') {
      return;
    }

    if (itemIdEditando) {
      const itemAtualizado = {
        id: itemIdEditando,
        data,
        km,
        gasolina,
      };

      axios.put(`http://192.168.100.43:3302/veiculos/${itemIdEditando}`, itemAtualizado)
        .then((response) => {
          console.log(response.data);
          fetchData();
          setExibirMensagemEdicao(true);
          setTimeout(() => {
            setExibirMensagemEdicao(false);
          }, 2000);
        })
        .catch((error) => {
          console.error(error);
        });

      setItemIdEditando(null);
    } else {
      const novoItem = {
        id: Date.now(),
        data,
        km,
        gasolina,
      };

      axios.post('http://192.168.100.43:3302/veiculos', novoItem)
        .then((response) => {
          console.log(response.data);
          setDados([...dados, novoItem]);
          refLista.current.scrollToEnd();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setData(new Date());
    setKm('');
    setGasolina('');
  };

  // const excluirItem = async (id) => {
  //   try {
  //     await axios.delete(`http://192.168.100.43:3302/veiculos/${id}`);
  //     fetchData();
  //     setExibirMensagemExclusao(true);
  //     setTimeout(() => {
  //       setExibirMensagemExclusao(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const excluirItem = async (id) => {
    try {
      await axios.delete(`http://192.168.100.43:3302/veiculos/${id}`);
      
      setExibirMensagemExclusao(true);
      setTimeout(() => {
        setExibirMensagemExclusao(false);
      }, 2000);

      setDados(dados.filter(item => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };


  const editarItem = (item) => {
    setItemIdEditando(item.id);
    setKm(item.km.toString());
    setGasolina(item.gasolina.toString());
  };

  const formatarData = (data) => {
    const dataFormatada = new Date(data);
    if (isNaN(dataFormatada)) {
      return '';
    }
    return format(dataFormatada, 'dd/MM/yyyy');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <ListItem.Content>
        <ListItem.Title>{formatarData(item.data)}</ListItem.Title>
        <ListItem.Subtitle>{item.km} KM</ListItem.Subtitle>
        <ListItem.Subtitle>{item.gasolina} Litros</ListItem.Subtitle>
      </ListItem.Content>
      <View style={styles.itemActions}>
        <Icon
          name="pencil"
          type="material-community"
          color="#9e9e9e"
          onPress={() => editarItem(item)}
        />
        <Icon
          name="delete"
          type="material"
          color="#ff5252"
          onPress={() => excluirItem(item.id)}
        />
      </View>
    </TouchableOpacity>
  );

  const renderMensagem = (mensagem) => (
    <View style={styles.containerMensagem}>
      <Text style={styles.textoMensagem}>{mensagem}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerTitulo}>
        <Icon name="car" type="font-awesome" size={40} color="#fff" />
      </View>

      <View style={styles.containerFormulario}>
        <Input
          label="Data"
          placeholder="Digite a data"
          value={formatarData(data)}
          editable={false}
        />
        <Input
          label="Quantos KM?"
          placeholder="Digite a quantidade de KM"
          keyboardType="numeric"
          value={km}
          onChangeText={(texto) => setKm(texto)}
        />
        <Input
          label="Gasolina (Litros)"
          placeholder="Digite a quantidade de gasolina"
          keyboardType="numeric"
          value={gasolina}
          onChangeText={(texto) => setGasolina(texto)}
        />
        <Button
          title={itemIdEditando ? 'Salvar' : 'Adicionar'}
          onPress={adicionarItem}
          disabled={km.trim() === '' || gasolina.trim() === ''}
          buttonStyle={styles.botaoAdicionar}
        />
      </View>

      <FlatList
        ref={refLista}
        data={dados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.containerLista}
      />

      {exibirMensagem && renderMensagem('Excluído com sucesso!')}
      {exibirMensagemEdicao && renderMensagem('Editado com sucesso!')}
      {exibirMensagemExclusao && renderMensagem('Excluído com sucesso!')}
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
  containerTitulo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  containerFormulario: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  botaoAdicionar: {
    backgroundColor: '#ff9800',
  },
  containerLista: {
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
  containerMensagem: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#51B449',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  textoMensagem: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ExemploCrud;
