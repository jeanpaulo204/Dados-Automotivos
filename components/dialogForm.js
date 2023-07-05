import React, { useState } from 'react';
import { Overlay, Text, Input, Button, ButtonGroup, Card, Icon } from 'react-native-elements';

const Dialog = ({ isVisible, onClose }) => {
  const [lembretes, setLembretes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Pendente');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleSave = () => {
    if (selectedIndex !== -1) {
      // Editar lembrete existente
      const updatedLembretes = [...lembretes];
      updatedLembretes[selectedIndex] = {
        text: inputText,
        status: selectedStatus,
      };
      setLembretes(updatedLembretes);
    } else {
      // Adicionar novo lembrete
      setLembretes([...lembretes, { text: inputText, status: selectedStatus }]);
    }
    setInputText('');
    setSelectedStatus('Pendente');
    setSelectedIndex(-1);
  };

  const handleDelete = (index) => {
    const updatedLembretes = [...lembretes];
    updatedLembretes.splice(index, 1);
    setLembretes(updatedLembretes);
  };

  const handleEdit = (index) => {
    const lembrete = lembretes[index];
    setInputText(lembrete.text);
    setSelectedStatus(lembrete.status);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setInputText('');
    setSelectedStatus('Pendente');
    setSelectedIndex(-1);
    onClose();
  };

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={handleClose}
      overlayStyle={{ width: '100%', height: '100%' }}
    >
      
      <Card containerStyle={{ flex: 1 }}>
      <Button

            title="Fechar"
            type='material'
            onPress={handleClose}
            buttonStyle={{ marginTop: 5, marginBottom: 10 }}
            containerStyle={{ width: '40%', alignSelf: 'center' }}
          />
           <Card.Divider />
        <Input
          placeholder="Digite seu lembrete"
          value={inputText}
          onChangeText={handleInputChange}
        />
        <ButtonGroup
          buttons={['Concluído', 'Pendente']}
          selectedIndex={selectedStatus === 'Pendente' ? 1 : 0}
          onPress={(selectedIndex) =>
            setSelectedStatus(selectedIndex === 0 ? 'Concluído' : 'Pendente')
          }
        />
        <Button
          title="Salvar"
          onPress={handleSave}
          buttonStyle={{ marginTop: 10, marginBottom: 5 }}
          containerStyle={{ width: '40%', alignSelf: 'center' }}
        />
        {selectedIndex !== -1 && (
          <Button
            title="Excluir"
            onPress={() => handleDelete(selectedIndex)}
            buttonStyle={{ marginTop: 5, marginBottom: 10 }}
            containerStyle={{ width: '40%', alignSelf: 'center' }}
          />
        )}
        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Anotações:</Text>
        {lembretes.map((lembrete, index) => (
          <Card key={index}>
            <Card.Title>{lembrete.text}</Card.Title>
            <Card.Divider />
            <Text>Status: {lembrete.status}</Text>
            <Button
              title="Editar"
              type="clear"
              onPress={() => handleEdit(index)}
            />
            <Button
              title="Excluir"
              type="clear"
              onPress={() => handleDelete(index)}
            />
          </Card>
        ))}
      </Card>
    </Overlay>
  );
};

export default Dialog;
