import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export function NotFound () {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>Not found</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    zIndex: -1
  }
})
