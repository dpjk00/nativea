import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { User } from './types';
import axios from 'axios';

const UserProfile: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, users } = route.params as { user: User; users: User[] };
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${user.id}`);
        setPhotoUrl(response.data.url);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photo:', error);
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [user.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.itemTextInfo}>Profil użytkownika</Text>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUrl }} style={styles.image} />
      </View>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.text}>@{user.username}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  text: {
    fontSize: 18,
    marginBottom: 4,
    color: 'white',
  },
  itemTextInfo: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
    color: "#e63939",
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: '#e63939',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    maxWidth: '100%',
    minHeight: 300,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
  }
});

export default UserProfile;
