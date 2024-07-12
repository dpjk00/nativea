import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Post, User } from './types';
import axios from 'axios';

interface PostInfoProps {
  posts: Post[];
  users: User[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostInfo: React.FC<PostInfoProps> = ({ posts, setPosts }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState<boolean>(true);
  const { post, users } = route.params as { post: Post; users: User[] };

  useEffect(() => {
    if (posts.length === 0) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
          setPosts(response.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

      fetchPosts();
    } else {
      setLoading(false);
    }
  }, []);

  const getUsernameById = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? `@${user.username}` : 'Nieznany użytkownik';
  };

  const handleDeletePost = () => {
    const updatedPosts = posts.filter(p => p.id !== post.id);
    setPosts(updatedPosts)
    navigation.navigate('PostList', { posts });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.itemTextInfo}>{getUsernameById(post.userId)}</Text>
      <View style={styles.combo}>
        <Text style={styles.title}>Tytuł</Text>
        <Text style={styles.text}>{post.title}</Text>
      </View>
      <View style={styles.combo}>
        <Text style={styles.title}>Treść</Text>
        <Text style={styles.text}>{post.body}</Text>
      </View>
      <TouchableOpacity style={styles.button2} onPress={() => handleDeletePost()}>
        <Text style={styles.buttonText}>Usuń</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    fontWeight: 'bold',
    color: "#e63939",
    textTransform: 'uppercase',
  },
  combo: {
    marginBottom: 20,
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
});

export default PostInfo;
