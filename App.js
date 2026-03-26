import React, {useState, useEffect} from 'react';
import { Alert, Modal, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Task from './components/Task';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';


export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editText, setEditText] = useState('');
  const [editIndex, setEditIndex] = useState(null);


  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTaskItems(tasks);
  });

  return unsubscribe;
}, []);


const handleAddTask = async () => {
  if (!task) return;
  Keyboard.dismiss();

  await addDoc(collection(db, "tasks"), {
    text: task,
    completed: false,
    createdAt: new Date()
  });

  setTask(null);
};

  const completeTask = async (index) => {
    Alert.alert(
      "Tâche",
      "Qu’est-ce que tu veux faire ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Modifier ✏️", onPress: () => editTask(index) },
        { 
          text: "Marquer comme terminé ✓", 
          onPress: async () => {
            const taskId = taskItems[index].id;

            await updateDoc(doc(db, "tasks", taskId), {
              completed: true
            });
          }
        },
      ]
    );
  };

const editTask = (index) => {
  setEditText(taskItems[index].text);
  setEditIndex(index);
  setEditVisible(true);
}

const saveEdit = async () => {
  if (!editText) return;

  const taskId = taskItems[editIndex].id;

  await updateDoc(doc(db, "tasks", taskId), {
    text: editText
  });

  setEditVisible(false);
};

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#393939' }]}>
      <Modal visible={editVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, darkMode && { backgroundColor: '#3d3d3d' }]}>
            <Text style={[styles.modalTitle, darkMode && { color: '#FFF' }]}>Modifier la tâche</Text>
            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Text style={styles.modalCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={styles.modalSave}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <StatusBar style={darkMode ? 'light' : 'dark'} />


      {/*Tâches du jour*/}
      <View style={styles.taskWrapper}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, darkMode && { color: '#FFF' }]}>Tâches du jour</Text>
          <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
            <Text style={styles.themeIcon}>{darkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.items}>
          {taskItems.length === 0 && (
            <Image
              source={darkMode ? require('./assets/dark.png') : require('./assets/light.png')}
              style={styles.emptyImage}
            />
          )}
          {/*l'emplacement des tâches*/}
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                  <Task key={index} text={item.text} completed={item.completed} 
                  onDelete={async () => {
                    await deleteDoc(doc(db, "tasks", item.id));
                  }} />
                </TouchableOpacity>
              )
            })
          }

        </ScrollView>
      </View>

      {/* Ecrire une taches */}
      <KeyboardAvoidingView
        behavior={Platform.OS == "android" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Ecrire une tache'} value={task} onChangeText={text => setTask(text)} />

        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>



    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },

  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },

  items: {
    marginTop: 30,
  },

  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },

  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },

  addText: {}, //edit this later + add task

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  themeIcon: {
    fontSize: 24,
  },

  emptyImage: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 100,
    opacity: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  modalCancel: {
    color: 'red',
    fontSize: 16,
  },

  modalSave: {
    color: '#0098fe',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
