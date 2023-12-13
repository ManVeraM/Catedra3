import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import axios from "axios";
import { Dimensions } from 'react-native';
import { Button } from 'react-native';
import { Modal, TextInput } from 'react-native';


function Card({ post, comments, onDelete, onEdit }) {
  return (
    <View style={styles.card}>
      <Text>{post.id}</Text>
      <Text>{post.title}</Text>
      <Text>{post.author}</Text>
      <Image source={{ uri: post.image }} style={styles.image} />
      {comments.map((comment, index) => (
        <Text key={index}>{comment.body}</Text>
      ))}
      <Button title="Delete" color="red" onPress={() => onDelete(post.id)} />
      <Button title="Edit" onPress={() => onEdit(post)} />
    </View>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);


  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setModalVisible(true);
  };

  const handleSave = () => {
    setPosts(posts.map(post => post.id === editingPost.id ? editingPost : post));
    setModalVisible(false);
  };


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
        <Card key={index} post={post} comments={comments[post.id] || []} onDelete={handleDelete} onEdit={handleEdit} />
      ))}
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text>Edit Post</Text>
          <TextInput value={editingPost?.title} onChangeText={text => setEditingPost({ ...editingPost, title: text })} />
          <TextInput value={editingPost?.author} onChangeText={text => setEditingPost({ ...editingPost, author: text })} />
          <TextInput value={editingPost?.image} onChangeText={text => setEditingPost({ ...editingPost, image: text })} />
          <Button title="Save" onPress={handleSave} />
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth / 5; 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    margin: 10,
    width: cardWidth, // Use the calculated card width
  },
  image: {
    width: '100%',
    height: 100,
  },
});