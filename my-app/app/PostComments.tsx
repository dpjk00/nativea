// PostList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { Post, User, Comment } from './types';

interface PostCommentsProps {
  posts: Post[];
  comments: Comment[];
  users: User[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const PostComments: React.FC<PostCommentsProps> = ({ users, comments, posts, setComments }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { post } = route.params as { post: Post; };

  useEffect(() => {
    if (comments.length === 0) {
      const fetchComments = async () => {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
          setComments(response.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

      fetchComments();
    } else {
      setLoading(false);
    }
  }, []);

  const getCommentsByPost = (post: Post) => {
    const comment = comments.filter(com => com.postId === post.id)
    return comment;
  }

  const navigateToAddComment = () => {
    navigation.navigate('AddComment', { post });
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button2} onPress={() => navigateToAddComment()}>
        <Text style={styles.buttonText}>Napisz komentarz</Text>
      </TouchableOpacity>
      <Text style={styles.commentStyle}>Licza komentarzy: {getCommentsByPost(post).length}</Text>
      <FlatList 
        data={getCommentsByPost(post)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.itemContainer}>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.itemText}>{item.body}</Text>
          </ThemedView>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    justifyContent: "center",
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: '90%',
    marginLeft: 15,
    marginBottom: 15,
  },
  commentStyle: {
    color: "#0b96e0",
    fontSize: 20,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 16,
    marginTop: 4,
    color: '#b8b8b8'
  },
  email: {
    color: "white",
    fontSize: 20,
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
  button2: {
    color: "#878787",
    backgroundColor: '#0b96e0',
    width: "70%",
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
    marginTop: 18,
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 30,
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

export default PostComments;
