// UserList.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User } from './types';

interface UserListProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserList: React.FC<UserListProps> = ({ users, setUsers }) => {
  const [newUser, setNewUser] = useState<User>({ id: 0, name: '', username: '', email: '' });
  const route = useRoute();
  const navigation = useNavigation();
  const { users: updatedUsers } = route.params ? route.params : { users };

  const handleAddUser = () => {
    if (newUser.name && newUser.username && newUser.email) {
      const newUserObj = {
        ...newUser,
        id: users.length + 1
      };
      setUsers([...users, newUserObj]);
      setNewUser({ id: 0, name: '', username: '', email: '' });
    } else {
      Alert.alert('Error', 'Uzupełnij wszystkie pola');
    }
  };

  const handleDeleteUser = (user: User) => {
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers)
  };

  const navigateToPostList = (users: User[]) => {
    navigation.navigate('PostList', {users});
  };

  const navigateToUserProfile = (user: User) => {
    navigation.navigate('UserProfile', { user, users });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#b3b3b3"
          value={newUser.name}
          onChangeText={(text) => setNewUser({ ...newUser, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#b3b3b3"
          value={newUser.username}
          onChangeText={(text) => setNewUser({ ...newUser, username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b3b3b3"
          value={newUser.email}
          onChangeText={(text) => setNewUser({ ...newUser, email: text })}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigateToPostList(users)}>
            <Text style={styles.buttonText}>Zobacz posty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddUser}>
            <Text style={styles.buttonText}>Dodaj użytkownika</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={updatedUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.itemContainer}>
            <ThemedView style={styles.packageName}>
              <Collapsible title={item.name}>
                <View style={styles.buttonContainer2}>
                  <TouchableOpacity style={styles.button2} onPress={() => navigateToUserProfile(item)}>
                    <Text style={styles.buttonText}>Profil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button2} onPress={() => handleDeleteUser(item)}>
                    <Text style={styles.buttonText}>Usuń</Text>
                  </TouchableOpacity>
                </View>
              </Collapsible>
            </ThemedView>
          </ThemedView>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    color: "white",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginRight: 20,
  },
  button: {
    color: "#878787",
    backgroundColor: '#e63939',
    width: "48%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  button2: {
    color: "#878787",
    backgroundColor: '#0b96e0',
    width: "48%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 13,
  },
  itemContainer: {
    padding: 10,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 15,
    color: 'white',
    marginBottom: 6,
  },
  itemTextInfo: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  packageName: {
    flexDirection: 'column',
  },
});

export default UserList;
