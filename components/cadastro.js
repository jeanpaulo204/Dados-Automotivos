import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';


const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [veiculo, setVeiculo] = useState('');

  const handleCadastro = () => {
    // Aqui você pode adicionar a lógica para lidar com o cadastro dos dados
    // Por exemplo, enviar os dados para um servidor ou atualizar o estado da aplicação
    console.log('Nome:', nome);
    console.log('Veículo:', veiculo);

    // Limpar os campos após o cadastro
    setNome('');
    setVeiculo('');  
  };

  

  return (
    <View style={styles.container}>
      <Input
        label="Nome"
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="Veículo"
        placeholder="Digite o tipo de veículo"
        value={veiculo}
        onChangeText={setVeiculo}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#ff9800',
  },
});

export default Cadastro;
