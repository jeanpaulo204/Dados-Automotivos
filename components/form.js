import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { Input, Button, ListItem, Icon } from 'react-native-elements';
import { format } from 'date-fns';
import DialogForm from './dialogForm';
import axios from 'axios';




const ExemploCrud = () => {
  // Estado para armazenar os dados da lista
  const [dados, setDados] = useState([]);

  // Estados para controlar os inputs do formulário
  const [data, setData] = useState(new Date());
  const [km, setKm] = useState('');
  const [gasolina, setGasolina] = useState('');

  // Estado para armazenar o ID do item em edição
  const [itemIdEditando, setItemIdEditando] = useState(null);

  // Estados para exibir mensagens de sucesso
  const [exibirMensagem, setExibirMensagem] = useState(false);
  const [exibirMensagemEdicao, setExibirMensagemEdicao] = useState(false);
  const [exibirMensagemExclusao, setExibirMensagemExclusao] = useState(false);

  // Referência para o componente FlatList
  const refLista = useRef(null);

  // Função executada ao carregar o componente, busca os dados da API
  useEffect(() => {
    fetchData();
  }, []);

  // Função para buscar os dados da API
  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.100.43:3302/veiculos');
      setDados(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [isDialogVisible, setDialogVisible] = useState(false);

  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  // Função para adicionar um novo item à lista
  const adicionarItem = () => {
    if (km.trim() === '' || gasolina.trim() === '') {
      return;
    }

    if (itemIdEditando) {
      // Atualiza o item existente na API se estiver em modo de edição
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
      // Adiciona um novo item à API
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

    // Limpa os campos do formulário após a adição ou edição
    setData(new Date());
    setKm('');
    setGasolina('');
  };

  // Função para excluir um item da lista
  const excluirItem = async (id) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir este item?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              // Envia uma solicitação DELETE para a API para excluir o item
              await axios.delete(`http://192.168.100.43:3302/veiculos/${id}`);
              setExibirMensagemExclusao(true);
              setTimeout(() => {
                setExibirMensagemExclusao(false);
              }, 2000);
              setDados(dados.filter((item) => item.id !== id));
            } catch (error) {
              console.log(error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  // Função para editar um item da lista
  const editarItem = (item) => {
    setItemIdEditando(item.id);
    setKm(item.km.toString());
    setGasolina(item.gasolina.toString());
  };

  // Função para formatar a data no formato "dd/MM/yyyy"
  const formatarData = (data) => {
    const dataFormatada = new Date(data);
    if (isNaN(dataFormatada)) {
      return '';
    }
    return format(dataFormatada, 'dd/MM/yyyy');
  };

  // Componente renderizado para cada item da lista
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

  // Componente renderizado para exibir as mensagens de sucesso
  const renderMensagem = (mensagem) => (
    <View style={styles.containerMensagem}>
      <Text style={styles.textoMensagem}>{mensagem}</Text>
    </View>
  );

  // Renderização do componente principal
  return (
    <View style={styles.container}>
      <View style={styles.containerTitulo}>
        <Icon name="car" type="font-awesome" size={40} color="#fff" />
      </View>
      <Button title="Anotações" onPress={openDialog} />
      <DialogForm isVisible={isDialogVisible} onClose={closeDialog} />
      <View style={styles.containerFormulario}>
        {/* Input para exibir a data */}
        <Input
          label="Data"
          placeholder="Digite a data"
          value={formatarData(data)}
          editable={false}
        />

        {/* Input para a quantidade de KM */}
        <Input
          label="Quantos KM?"
          placeholder="Digite a quantidade de KM"
          keyboardType="numeric"
          value={km}
          onChangeText={(texto) => setKm(texto)}
        />

        {/* Input para a quantidade de gasolina */}
        <Input
          label="Gasolina (Litros)"
          placeholder="Digite a quantidade de gasolina"
          keyboardType="numeric"
          value={gasolina}
          onChangeText={(texto) => setGasolina(texto)}
        />

        {/* Botão para adicionar ou salvar o item */}
        <Button
          title={itemIdEditando ? 'Salvar' : 'Adicionar'}
          onPress={adicionarItem}
        />
      </View>

      {/* FlatList para exibir os itens */}
      <FlatList
        ref={refLista}
        data={dados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {/* Exibição das mensagens de sucesso */}
      {exibirMensagem && renderMensagem('Item adicionado com sucesso!')}
      {exibirMensagemEdicao && renderMensagem('Item editado com sucesso!')}
      {exibirMensagemExclusao && renderMensagem('Item excluído com sucesso!')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  containerTitulo: {
    alignItems: 'center',
    marginVertical: 10,
  },
  containerFormulario: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  itemActions: {
    flexDirection: 'row',
  },
  containerMensagem: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textoMensagem: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ExemploCrud;
