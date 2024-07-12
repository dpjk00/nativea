// App.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserList from './UserList';
import PostList from './PostList';
import UserProfile from './UserProfile';
import PostInfo from './PostInfo';
import PostComments from './PostComments'
import AddComment from './AddComment';
import { User, Post, Comment } from './types';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('https://jsonplaceholder.typicode.com/users?_start=0&_limit=5');
        const postResponse = await axios.get('https://jsonplaceholder.typicode.com/posts?_start=0&_limit=15');
        const commentResponse = await axios.get('https://jsonplaceholder.typicode.com/comments');
        setUsers(userResponse.data);
        setPosts(postResponse.data);
        setComments(commentResponse.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList">
          {props => <UserList {...props} users={users} setUsers={setUsers} />}
        </Stack.Screen>
        <Stack.Screen name="PostList">
          {props => <PostList {...props} users={users} posts={posts} setPosts={setPosts} />}
        </Stack.Screen>
        <Stack.Screen name="UserProfile">
          {props => <UserProfile {...props} users={users} />}
        </Stack.Screen>
        <Stack.Screen name="PostInfo">
          {props => <PostInfo {...props} posts={posts} setPosts={setPosts} />}
        </Stack.Screen>
        <Stack.Screen name="PostComments">
          {props => <PostComments {...props} users={users} comments={comments} posts={posts} setComments={setComments} />}
        </Stack.Screen>
        <Stack.Screen name="AddComment">
          {props => <AddComment {...props} comments={comments} setComments={setComments} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
