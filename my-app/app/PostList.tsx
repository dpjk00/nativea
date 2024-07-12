// PostList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { Post, User } from './types';

interface PostListProps {
  users: User[];
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostList: React.FC<PostListProps> = ({ users, posts, setPosts }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [newPost, setNewPost] = useState<Post>({ userId: 1, id: Date.now(), title: '', body: '' });
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (posts.length === 0) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_start=0&_limit=15');
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

  const handleAddPost = () => {
    if (newPost.body && newPost.title && newPost.userId) {
      const newPostObj = {
        ...newPost,
        id: posts.length + 1
      };
      setPosts([...posts, newPostObj]);
      setNewPost({ id: 0, userId: 0, title: '', body: '' });
    } else {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
    }
  };

  const getUsernameById = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? `@${user.username}` : 'Nieznany użytkownik';
  };

  const navigateToPostInfo = (post: Post) => {
    navigation.navigate('PostInfo', { post, posts, users });
  };

  const navigateToCommentsPostInfo = (post: Post) => {
    navigation.navigate('PostComments', { post });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#b3b3b3"
          value={newPost.title}
          onChangeText={(text) => setNewPost({ ...newPost, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Body"
          placeholderTextColor="#b3b3b3"
          value={newPost.body}
          onChangeText={(text) => setNewPost({ ...newPost, body: text })}
        />
        <RNPickerSelect
          placeholder={{ label: 'Wybierz...', value: null }}
          onValueChange={(value) => setNewPost({ ...newPost, userId: value })}
          style={pickerSelectStyles}
          items={users.map(user => ({ label: user.username, value: user.id }))}
          value={newPost.userId}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAddPost}>
            <Text style={styles.buttonText}>Dodaj post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={posts}
        style={styles.list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.itemContainer}>
            <ThemedView style={styles.packageName}>
              <Collapsible title={item.title}>
                <Text style={styles.itemText}>post napisany przez {getUsernameById(item.userId)}</Text>
                <View style={styles.buttonContainer2}>
                  <TouchableOpacity style={styles.button2} onPress={() => navigateToCommentsPostInfo(item)}>
                    <Text style={styles.buttonText}>Komentarze</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button2} onPress={() => navigateToPostInfo(item)}>
                    <Text style={styles.buttonText}>Wejdź</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: '90%',
    marginLeft: 15,
    padding: 5,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 15,
    color: '#b8b8b8'
  },
  packageName: {
    flexDirection: 'column',
    flex: 1,
    flexWrap: 'wrap'
  },
  inputContainer: {
    flexDirection: 'column',
    padding: 20,
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
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  buttonContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    marginTop: 18,
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
  list: {
 
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    borderColor: 'white',
    borderRadius: 8,
    borderWidth: 3,
    color: 'white',
    marginBottom: 10,
    backgroundColor: '#e63939'
  },
});

export default PostList;
