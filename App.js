                    import React, { useState } from 'react';
                    import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
                    import { NavigationContainer } from '@react-navigation/native';
                    import { createStackNavigator } from '@react-navigation/stack';
                    import { Ionicons } from '@expo/vector-icons';
                    import Form from './components/form';


                    // Componente da tela inicial
                    function HomeScreen({ navigation }) {
                    const [username, setUsername] = useState('');
                    const [password, setPassword] = useState('');

                    const handleLogin = () => {
                        if (username === 'Admin' && password === '12345') {
                        navigation.navigate('Consulta a Anotações');
                        } else {
                        Alert.alert('Erro de autenticação', 'Credenciais inválidas');
                        }
                    };




                    return (

                        <View style={styles.container}>
                        <View style={styles.square}>
                        <Ionicons name="ios-lock-closed" size={30} color="#777" style={styles.icon} />
                            <TextInput
                            style={styles.input}
                            placeholder="Nome de usuário"
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor="#777"
                            />
                            <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#777"
                            />
                            <Button title="Login" onPress={handleLogin} color="#ff9800" />
                        </View>
                        </View>
                    );
                    }


                    // Componente da tela de detalhes
                    function DetailsScreen() {
                    return <Form />;
                    }

                    // Criar o objeto Stack Navigator
                    const Stack = createStackNavigator();

                    // Componente principal do aplicativo
                    export default function App() {
                    return (
                        <View style={styles.appContainer}>
                        <NavigationContainer>
                            <Stack.Navigator>
                            <Stack.Screen name="Bem-Vindo" component={HomeScreen} />
                            <Stack.Screen name="Consulta a Anotações" component={DetailsScreen} />
                            </Stack.Navigator>
                        </NavigationContainer>
                        </View>
                    );
                    }

                    const styles = StyleSheet.create({
                    appContainer: {
                        flex: 1,

                    },
                    container: {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#00bcd4',
                    },
                    square: {
                        backgroundColor: '#fff',
                        width: 350,
                        padding: 40,
                        borderRadius: 8,
                    },

                    icon: {
                        alignSelf: 'center',
                        marginBottom: 30,
                    },
                    input: {
                        height: 40,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        marginBottom: 16,
                        paddingHorizontal: 8,
                        color: '#777',
                    },
                    });