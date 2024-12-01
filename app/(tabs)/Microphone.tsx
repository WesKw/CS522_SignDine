import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Modal,
  Image,
} from 'react-native';

export default function Tab() {
  const [micStatus, setMicStatus] = useState('Not Listening');
  const [isMicOn, setIsMicOn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  const [vibrate, setVibrate] = useState(false);
  const [autoReminder, setAutoReminder] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // For info button

  const reminderOptions = [5, 10, 15, 20, 30];

  useEffect(() => {
    let interval;
    if (isMicOn && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isMicOn) {
      setIsMicOn(false);
      setMicStatus('Not Listening');
    }
    return () => clearInterval(interval);
  }, [isMicOn, timer]);

  const toggleMic = () => {
    if (isMicOn) {
      setIsMicOn(false);
      setMicStatus('Not Listening');
    } else if (orderNumber) {
      setIsMicOn(true);
      setMicStatus('Listening');
      setTimer(autoReminder * 60);
    }
  };

  const handleReminderSelect = (value) => {
    setAutoReminder(value);
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Microphone</Text>
      <View style={styles.statusBar}>
        <Text>Status: {micStatus}</Text>
      </View>

      {/* Microphone Icon */}
      <View style={styles.micIconContainer}>
        <Image
          source={require('../../assets/images/mic.png')} // Replace with your mic icon path
          style={styles.micIcon}
        />
      </View>

      {/* Timer */}
      <Text style={styles.timer}>
        Timer: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
      </Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter order number"
        value={orderNumber}
        onChangeText={setOrderNumber}
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <Text>Vibrate: </Text>
        <Switch value={vibrate} onValueChange={setVibrate} />
      </View>
      <View style={styles.row}>
        <Text>Auto-Reminder: </Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown((prev) => !prev)}
        >
          <Text style={styles.dropdownText}>{autoReminder} minutes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowInfo(true)} style={styles.infoButton}>
          <Text style={styles.infoText}>i</Text>
        </TouchableOpacity>
      </View>

      {/* Start Button */}
      <TouchableOpacity onPress={toggleMic} style={styles.startButton}>
        <Text style={styles.startButtonText}>
          {isMicOn ? 'Stop Listening' : 'Start Listening'}
        </Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      {showDropdown && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownContainer}>
              {reminderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOption}
                  onPress={() => handleReminderSelect(option)}
                >
                  <Text style={styles.dropdownOptionText}>{option} minutes</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Info Modal */}
      {showInfo && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowInfo(false)}
          >
            <View style={styles.infoContainer}>
              <Text style={styles.infoDescription}>
                The Auto-Reminder allows you to set a countdown. When your timer
                reaches zero, the microphone will stop listening automatically.
              </Text>
              <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusBar: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  micIconContainer: {
    marginVertical: 16,
  },
  micIcon: {
    width: 80, // Adjust size based on your icon dimensions
    height: 80,
  },
  timer: {
    fontSize: 18,
    marginVertical: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '80%',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
  },
  infoButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007BFF',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    alignSelf: 'center',
  },
  dropdownOption: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  infoDescription: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});