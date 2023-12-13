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
      <Text>Titulo: {post.title}</Text>
      <Divider />
      <Text>Autor: {post.author}</Text>
      <Divider />
      <Image source={{ uri: post.image }} style={styles.image} />
      {comments.length > 0 ? <Text>Comentarios:</Text> : <Text>No hay comentarios</Text>}
      <Divider />
      {comments.map((comment, index) => (
        <React.Fragment key={index}>
          <Text>{comment.body}</Text>
          <Divider />
        </React.Fragment>
      ))}
      <Button title="Delete" color="red" onPress={() => onDelete(post.id)} style={styles.button} />
      <Button title="Edit" onPress={() => onEdit(post)} style={styles.button} />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [search, setSearch] = useState('');
  const filteredPosts = posts.filter(post => post.author.toLowerCase().includes(search.toLowerCase()));




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
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por usuario"
        value={search}
        onChangeText={setSearch}
      />
      {filteredPosts.map((post, index) => (
        <Card key={index} post={post} comments={comments[post.id] || []} onDelete={handleDelete} onEdit={handleEdit} />
      ))}
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text>Editar Post</Text>
          <TextInput value={editingPost?.title} onChangeText={text => setEditingPost({ ...editingPost, title: text })} />
          <TextInput value={editingPost?.author} onChangeText={text => setEditingPost({ ...editingPost, author: text })} />
          <TextInput value={editingPost?.image} onChangeText={text => setEditingPost({ ...editingPost, image: text })} />
          <Button title="Guardar" onPress={handleSave} />
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
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
    marginBottom: 10, // Add bottom margin to the image
  },
  button: {
    marginTop: 10, // Add top margin to the buttons
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
});