import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const Stack = createStackNavigator();

// Pantalla de Login
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      AsyncStorage.setItem('user', username);
      navigation.navigate('Home');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// Pantalla Home
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Productos')}
        >
          <Text style={styles.buttonText}>Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Sección de Usuarios")}
        >
          <Text style={styles.buttonText}>Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Sección de Ventas")}
        >
          <Text style={styles.buttonText}>Ventas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            AsyncStorage.removeItem('user');
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Pantalla de Productos
function ProductosScreen() {
  const [productos, setProductos] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const addProduct = () => {
    if (newProductName && newProductPrice) {
      setProductos([
        ...productos,
        { id: productos.length + 1, name: newProductName, price: parseFloat(newProductPrice) }
      ]);
      setNewProductName('');
      setNewProductPrice('');
    }
  };

  const removeProduct = (id) => {
    setProductos(productos.filter(product => product.id !== id));
  };

  const editProduct = (id, newName, newPrice) => {
    const updatedProducts = productos.map(product =>
      product.id === id ? { ...product, name: newName, price: parseFloat(newPrice) } : product
    );
    setProductos(updatedProducts);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Productos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Producto"
        value={newProductName}
        onChangeText={setNewProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={newProductPrice}
        onChangeText={setNewProductPrice}
      />
      <Button title="Agregar Producto" onPress={addProduct} />
      <FlatList
        data={productos}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name} - ${item.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => editProduct(item.id, prompt('Nuevo nombre:', item.name), prompt('Nuevo precio:', item.price.toString()))}>
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeProduct(item.id)}>
              <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

// Navegación
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Productos" component={ProductosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-start',  // Alineación a la izquierda
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#4682b4',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'column',  // Coloca los botones en una columna
    alignItems: 'flex-start',  // Alineación a la izquierda
    width: '100%',
  },
  button: {
    backgroundColor: '#4682b4', // Azul acero para los botones
    marginVertical: 10,
    padding: 15,
    width: '100%',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 25,  // Tamaño grande de fuente
    color: '#fff', // Texto blanco
    textAlign: 'center',
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  actionText: {
    color: '#4682b4',
    textDecorationLine: 'underline',
  },
});


