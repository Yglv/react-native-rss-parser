
import { WebView } from 'react-native-webview'
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as rssParser from 'react-native-rss-parser'
import { Entypo } from '@expo/vector-icons'
import { NotFound } from './NotFound.js'

export default function App () {
  const [items, setItems] = useState([])
  const [link, setLink] = useState('')
  const [activeLink, setActiveLink] = useState(false)
  const [resultNotFound, setResultNotFound] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleClose = () => {
    setActiveLink(false)
  }

  const handleOpen = () => {
    setActiveLink(true)
  }

  const findItems = () => {
    fetch('http://www.dailymail.co.uk/sport/index.rss')
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        console.log(rss.items[0])
        setItems(rss.items)
      })
  }

  const handleOnSearchInput = async text => {
    setSearchQuery(text)
    if (!text.trim()) {
      setSearchQuery('')
      setResultNotFound(false)
      return await findItems()
    }
    const filteredSearchItem = items.filter(item => {
      if (item.title.toLowerCase().includes(text.toLowerCase())) {
        return item
      }
    })
    if (filteredSearchItem.length) {
      setItems([...filteredSearchItem])
    } else {
      setResultNotFound(true)
    }
  }

  useEffect(() => {
    findItems()
  }, [])

  return (
    <>
      <View style={styles.container}>
        <Entypo name='magnifying-glass' style={styles.searchIcon} size={22} color='#969696'></Entypo>
        <TextInput
          style={styles.textInput}
          value={searchQuery}
          placeholder='Search'
          onChangeText={searchText => handleOnSearchInput(searchText)}
        />
        {searchQuery ? (<Entypo name='cross' onPress={() => setSearchQuery('')} style={styles.clearIcon} size={25} color='#969696'></Entypo>) : null}
        { resultNotFound
          ? (<NotFound/>)
          : (<FlatList
          data={items}
          numColumns={1}
          style={styles.flatList}
          renderItem={({ item }) => (
              <Pressable
                onPress={() => { setLink(item.id); handleOpen(); console.log(link) }}>
                <View style={styles.flatItem}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.enclosures[0].url
                    }}
                  />
                  <View style={styles.textView}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.published}>{item.published}</Text>
                  </View>
                </View>
              </Pressable>
          )}
        >
        </FlatList>)}
      </View>
      <Modal
        animationType={'slide'}
        visible={activeLink}
        onRequestClose={() => handleClose()}>
        <TouchableOpacity style={{ height: '10%', backgroundColor: '#21b017', paddingTop: 40, paddingLeft: 330}}>
          <Entypo name='cross' onPress={() => handleClose()}  style={styles.closeIcon} size={40} color='white'></Entypo>
        </TouchableOpacity>
        <WebView
          source={{
            uri: link
          }}
          originWhitelist={['*']}
          style={{ flex: 1}}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flatList: {
    flex: 1,
    width: '96%',
    paddingTop: 30
  },
  flatItem: {
    flex: 1,
    flexDirection: 'row',
    height: 150,
    width: '100%',
    paddingLeft: 5
  },
  textView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    paddingTop: 30,
    paddingBottom: 45,
    height: '100%',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  published: {
    fontSize: 10,
    marginTop: 5
  },
  image: {
    width: '30%',
    height: '70%',
    borderRadius: 15,
    alignSelf: 'center'
  },
  textInput: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#e7e9e7',
    height: 35,
    fontSize: 16,
    borderRadius: 10,
    paddingLeft: 35,
    marginTop: 70,
    color: '#969696'
  },
  searchIcon: {
    position: 'absolute',
    top: 75,
    left: 25,
    zIndex: 3
  },
  clearIcon: {
    position: 'absolute',
    top: 75,
    left: '87%',
    zIndex: 3
  },
})
