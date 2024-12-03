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
  Animated,
} from 'react-native';

export default function Tab() {
  const [micStatus, setMicStatus] = useState('Not Listening');
  const [isMicOn, setIsMicOn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  const [vibrate, setVibrate] = useState(false);
  const [autoReminderValue, setAutoReminderValue] = useState('');
  const [autoReminderUnit, setAutoReminderUnit] = useState('seconds');
  const [unitDropdownVisible, setUnitDropdownVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // For info button
  const [popupAnim] = useState(new Animated.Value(1)); // For auto-reminder popup animation
  const [micAnim] = useState(new Animated.Value(0)); // For microphone animation
  const [headingAnim] = useState(new Animated.Value(1)); // For heading animation

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
      setTimer(0); // Reset timer to 00:00
      setOrderNumber(''); // Clear the order number text field
      Animated.timing(micAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (orderNumber) {
      setIsMicOn(true);
      setMicStatus('Listening');
      const timeInSeconds =
        autoReminderUnit === 'minutes'
          ? parseInt(autoReminderValue) * 60
          : parseInt(autoReminderValue);
      setTimer(timeInSeconds || 0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(micAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(micAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  };

  const startPopupAnim = () => {
    Animated.spring(popupAnim, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start(() =>
      Animated.spring(popupAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start()
    );
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(headingAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(headingAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const micStatusColor = micStatus === 'Listening' ? 'green' : 'red';

  return (
    <View style={styles.container}>
      {/* Enhanced Page Heading */}
      <Animated.Text
        style={[
          styles.heading,
          { transform: [{ scale: headingAnim }] },
        ]}
      >
        Microphone
      </Animated.Text>

      {/* Animated Mic Icon */}
      <Animated.Image
        source={require('../../assets/images/micgraybg.jpg')} // Replace with your mic icon path
        style={[
          styles.micIcon,
          {
            transform: [
              {
                rotate: micAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '15deg'],
                }),
              },
            ],
          },
        ]}
      />

      {/* Listening Text */}
      {isMicOn && orderNumber ? (
        <Text style={styles.title}>Listening to order number: {orderNumber}</Text>
      ) : null}

      <View style={styles.statusBar}>
        <Text style={[styles.statusText, { color: micStatusColor }]}>
          Status: {micStatus}
        </Text>
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

      {/* Auto-Reminder with Popup Animation */}
      <Animated.View
        style={[
          styles.autoReminderContainer,
          { transform: [{ scale: popupAnim }] },
        ]}
        onTouchStart={startPopupAnim}
      >
        <View style={styles.autoReminderHeader}>
          <Text style={styles.label}>Auto - Reminder</Text>
          <TouchableOpacity onPress={() => setShowInfo(true)} style={styles.infoButton}>
            <Text style={styles.infoText}>i</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.autoReminderInputs}>
          <TextInput
            style={styles.reminderInput}
            placeholder="Value"
            value={autoReminderValue}
            onChangeText={setAutoReminderValue}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => setUnitDropdownVisible(true)}
            style={styles.unitDropdown}
          >
            <Text style={styles.unitDropdownText}>{autoReminderUnit}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Vibrate */}
      <View style={styles.vibrateRow}>
        <Text style={styles.vibrateLabel}>Vibrate</Text>
        <Switch value={vibrate} onValueChange={setVibrate} />
      </View>

      {/* Unit Dropdown Modal */}
      {unitDropdownVisible && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setUnitDropdownVisible(false)}
          >
            <View style={styles.dropdownContainer}>
              {['seconds', 'minutes'].map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setAutoReminderUnit(unit);
                    setUnitDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Start Button */}
      <TouchableOpacity onPress={toggleMic} style={styles.startButton}>
        <Text style={styles.startButtonText}>
          {isMicOn ? 'Stop Listening' : 'Start Listening'}
        </Text>
      </TouchableOpacity>

      {/* Info Modal */}
      {showInfo && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowInfo(false)}
          >
            <View style={styles.infoContainer}>
              <Text style={styles.infoDescription}>
                The Auto-Reminder allows you to set a countdown in seconds or
                minutes. When the timer reaches zero, the microphone will stop
                listening automatically and notify you.
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
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 16,
  },
  micIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  statusBar: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '80%',
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  autoReminderContainer: {
    width: '80%',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  autoReminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  infoButton: {
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
  autoReminderInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  reminderInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '48%',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  unitDropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    width: '48%',
    alignItems: 'center',
  },
  unitDropdownText: {
    fontSize: 16,
  },
  vibrateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '80%',
    marginBottom: 16,
  },
  vibrateLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  startButton: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 12,
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
    borderRadius: 12,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  dropdownOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  dropdownOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
