import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Task = (props) => {

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.square}>
                    {props.completed && <Text style={{ color: '#008000 ', fontWeight: 'bold', textAlign: 'center' }}>✓</Text>}
                </View>
                <Text style={[styles.itemText, props.completed && { textDecorationLine: 'line-through', color: '#C0C0C0' }]}>{props.text}</Text>
            </View>
                <TouchableOpacity onPress={props.onDelete}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,

    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    itemText: {
        maxWidth: '80%',
    },

});


export default Task;