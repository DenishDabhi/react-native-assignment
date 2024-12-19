import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeartFillIcon from '../icons/heart-fill-icon';
import HeartIcon from '../icons/heart-icon';
import {styles} from './style';

const FavList = () => {
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const getData = async () => {
    try {
      let response = await fetch('https://reqres.in/api/users?page=2');
      let data = await response.json();
      setData(data.data);
    } catch (error) {
      console.log('Error', error);
    }
  };
  useEffect(() => {
    getData();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  const toggleFavorite = async (item: any) => {
    let updatedFavorites: any;
    if (favorites.find((fav: any) => fav.id === item.id)) {
      updatedFavorites = favorites.filter((fav: any) => fav.id !== item.id);
    } else {
      updatedFavorites = [...favorites, item];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const renderItem = ({item}: {item: any}) => {
    const isFavorite = favorites.some((fav: any) => fav.id === item.id);
    return (
      <View style={styles.card}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <Pressable
          onPress={() => toggleFavorite(item)}
          style={styles.iconButton}>
          {isFavorite ? <HeartFillIcon fill={'red'} /> : <HeartIcon />}
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Items</Text>
      <View style={{flex: 1,borderRadius:10}}>
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
      {favorites.length > 0 && (
        <View style={{flex: 1.5}}>
          <Text style={styles.header}>Favorite Items</Text>
          <FlatList
            data={favorites}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

export default FavList;
