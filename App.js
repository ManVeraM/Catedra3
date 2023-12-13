import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import axios from "axios";

function Card({ post, comments }) {
  return (
    <View style={styles.card}>
      <Text>{post.id}</Text>
      <Text>{post.title}</Text>
      <Text>{post.author}</Text>
      <Image source={{ uri: post.image }} style={styles.image} />
      {comments.map((comment, index) => (
        <Text key={index}>{comment.body}</Text>
      ))}
    </View>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/comments')
      .then(response => {
        const groupedComments = response.data.reduce((acc, comment) => {
          acc[comment.postId] = [...(acc[comment.postId] || []), comment];
          return acc;
        }, {});
        setComments(groupedComments);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {posts.map((post, index) => (
        <Card key={index} post={post} comments={comments[post.id] || []} />
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    margin: 10,
    flexBasis: '20%',
  },
  image: {
    width: '100%',
    height: 100,
  },
});