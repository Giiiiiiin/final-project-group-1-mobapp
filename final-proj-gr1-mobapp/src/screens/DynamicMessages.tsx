import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';

const DynamicMessages = () => {
  const { currentUser, users, sendMessage, theme } = useGlobalContext();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (!replyToMessage || !replyText.trim()) return;

    sendMessage(
      replyToMessage.fromUserId,
      currentUser.id,
      replyText.trim(),
      'RESPONSE'
    );

    sendMessage(
      currentUser.id,
      currentUser.id,
      `You replied to ${getUserEmailById(replyToMessage.fromUserId)}: ${replyText.trim()}`,
      'REPLY'
    );

    setReplyText('');
    setReplyModalVisible(false);
  };

  const getUserEmailById = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.email : 'Unknown';
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'REQUEST': return '#4CAF50';
      case 'NOTIFICATION': return '#2196F3';
      case 'RESPONSE': return '#FF8A80';
      case 'REPLY': return '#B0BEC5';
      default: return '#fff';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={currentUser?.messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={item.type === 'REPLY' || item.type === 'NOTIFICATION'}
            onPress={() => {
              if (item.fromUserId !== currentUser.id && item.type !== 'NOTIFICATION' && item.type !== 'REPLY') {
                setReplyToMessage(item);
                setReplyModalVisible(true);
              }
            }}
            style={[styles.messageCard, { borderLeftColor: getMessageColor(item.type), borderLeftWidth: 6 }]}
          >
            <Text style={[styles.messageType, { color: getMessageColor(item.type) }]}>{item.type}</Text>
            <Text style={styles.messageContent}>{item.content}</Text>
            <Text style={styles.messageMeta}>
              From: {getUserEmailById(item.fromUserId)} | To: {getUserEmailById(item.toUserId)}
            </Text>
            <Text style={styles.messageMeta}>At: {new Date(item.timestamp).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages found.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={replyModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reply to {getUserEmailById(replyToMessage?.fromUserId)}</Text>
            <TextInput
              placeholder="Type your reply..."
              value={replyText}
              onChangeText={setReplyText}
              style={styles.input}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setReplyModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]} onPress={handleSendReply}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DynamicMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  messageCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  messageType: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  messageContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  messageMeta: {
    fontSize: 12,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#D32F2F',
    width: '48%',
    alignItems: 'center',
  },
  sendButton: {
    padding: 12,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});