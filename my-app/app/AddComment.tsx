import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Comment, Post } from './types';

interface AddCommentProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const AddComment: React.FC<AddCommentProps> = ({ comments, setComments }) => {
  const [newComment, setNewComment] = useState<Comment>({ postId: 1, id: Date.now(), name: '', email: '', body: '' });
  const navigation = useNavigation();
  const route = useRoute();
  const { post } = route.params as { post: Post };

  const handleAddComment = () => {
    if (newComment.body && newComment.name && newComment.email) {
      const newCommentObj = {
        ...newComment,
        id: comments.length + 1,
        postId: post.id,
      };
      setComments([...comments, newCommentObj]);
      setNewComment({ id: 0, postId: post.id, name: '', email: '', body: '' });
      navigation.goBack();
    } else {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tytuł"
          placeholderTextColor="#b3b3b3"
          value={newComment.name}
          onChangeText={(text) => setNewComment({ ...newComment, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Treść"
          placeholderTextColor="#b3b3b3"
          value={newComment.body}
          onChangeText={(text) => setNewComment({ ...newComment, body: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b3b3b3"
          value={newComment.email}
          onChangeText={(text) => setNewComment({ ...newComment, email: text })}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAddComment}>
            <Text style={styles.buttonText}>Dodaj komentarz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
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
  button: {
    backgroundColor: '#e63939',
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

export default AddComment;
