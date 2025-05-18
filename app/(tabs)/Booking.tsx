import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, bookingCol } from '@/lib/firebase';
import { Feather } from '@expo/vector-icons';


export default function BookingScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);  const [time, setTime] = useState(new Date());
  const [guests, setGuests] = useState('2');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('vi-VN', options);
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setDate(selected);
    }
  };

  const onChangeTime = (_: any, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) {
      setTime(selected);
    }
  };

  const submitBooking = async () => {
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để đặt bàn');
      return;
    }
    
    // Basic validation
    if (parseInt(guests, 10) < 1 || parseInt(guests, 10) > 20) {
      Alert.alert('Lỗi', 'Số lượng khách phải từ 1 đến 20 người');
      return;
    }

    // Check if time is within 9:00–21:00
  const bookingHour = time.getHours();
  if (bookingHour < 9 || bookingHour > 21) {
    Alert.alert('Lỗi', 'Chỉ có thể đặt bàn từ 9:00 đến 21:00');
    return;
  }

    // Check if date is in the future
    const now = new Date();
      const bookingDate = new Date(date);
    if (bookingDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
      return;
    }

    setLoading(true);
    try {
      const bookingRef = await addDoc(bookingCol, {
        userId: user.uid,
        date: date.toISOString().split('T')[0],
        time: formatTime(time),
        guests: parseInt(guests, 10),
        notes,
        createdAt: new Date(),
        status: 'pending',
      });

      // Add notification for the booking
      await addDoc(collection(db, "noti"), {
        userId: user.uid,
        title: `Đặt bàn #${Math.floor(Math.random() * 1000)}`,
        message: `Đặt bàn cho ${guests} người vào ngày ${formatDate(date)} lúc ${formatTime(time)}`,
        time: serverTimestamp(),
        read: false,
        type: 'booking'
      });

      Alert.alert(
        'Đặt bàn thành công!', 
        `Chúng tôi đã nhận được đơn đặt bàn của bạn vào ngày ${formatDate(date)} lúc ${formatTime(time)} cho ${guests} người. Nhà hàng sẽ liên hệ với bạn để xác nhận.`,
        [
          { 
            text: 'Xem lịch sử đặt bàn', 
            onPress: () => router.push('/(profile)/historybooking')
          },
          { 
            text: 'Quay lại',
            onPress: () => router.push('/(tabs)/Booking'),
            style: 'cancel' 
          }
        ]
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể đặt bàn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
       <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000' }}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <Text style={styles.headerTitle}>Đặt bàn</Text>
              <Text style={styles.headerTitle}>
                Hãy để chúng tôi chuẩn bị một bàn tuyệt vời cho bạn
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.container}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>
                <Feather name="calendar" size={20} color="#0B3B5D" /> Ngày và giờ
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Ngày đặt bàn:</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Feather name="calendar" size={18} color="#666" style={styles.inputIcon} />
                  <Text style={styles.inputText}>{formatDate(date)}</Text>
                  <Feather name="chevron-down" size={18} color="#666" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    minimumDate={new Date()}
                  />
                )}
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Giờ đặt bàn:</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={styles.input}
                >
                  <Feather name="clock" size={18} color="#666" style={styles.inputIcon} />
                  <Text style={styles.inputText}>{formatTime(time)}</Text>
                  <Feather name="chevron-down" size={18} color="#666" />
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                  />
                )}
              </View>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>
                <Feather name="users" size={20} color="#0B3B5D" /> Thông tin đặt bàn
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Số khách:</Text>
                <View style={styles.guestInputContainer}>
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => {
                      const value = parseInt(guests, 10);
                      if (value > 1) setGuests((value - 1).toString());
                    }}
                  >
                    <Feather name="minus" size={18} color="#0B3B5D" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.guestInput}
                    keyboardType="numeric"
                    value={guests}
                    onChangeText={(text) => {
                      const value = parseInt(text, 10);
                      if (!isNaN(value) && value >= 1 && value <= 20) {
                        setGuests(text);
                      }
                    }}
                    maxLength={2}
                    textAlign="center"
                  />
                  
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => {
                      const value = parseInt(guests, 10);
                      if (value < 20) setGuests((value + 1).toString());
                    }}
                  >
                    <Feather name="plus" size={18} color="#0B3B5D" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Ghi chú đặc biệt:</Text>
                <View style={styles.textAreaContainer}>
                  <Feather name="edit-2" size={18} color="#666" style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 10 }]} />
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={4}
                    placeholder="Nhập yêu cầu đặc biệt, ví dụ: ghế cao cho trẻ em, không gian riêng tư, bàn gần cửa sổ, v.v."
                    placeholderTextColor="#888"
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bookingInfoContainer}>
            <View style={styles.infoRow}>
              <Feather name="info" size={16} color="#666" />
              <Text style={styles.infoText}>
                Chúng tôi sẽ giữ bàn trong vòng 15 phút kể từ thời gian đặt
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="phone" size={16} color="#666" />
              <Text style={styles.infoText}>
                Nhà hàng sẽ liên hệ với bạn để xác nhận đặt bàn
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.confirmButton, loading && styles.disabledButton]} 
            onPress={submitBooking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="check-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.confirmButtonText}>Xác nhận đặt bàn</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerImage: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#0B3B5D',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guestButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bookingInfoContainer: {
    marginVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guestInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputIcon: {
    justifyContent: 'space-between',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B3B5D',
    marginBottom: 12,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  timePicker: { width: '100%', marginBottom: 16, backgroundColor: '#000' },
  button: {
    backgroundColor: '#0B3B5D',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  formSection: {
    marginVertical: 5,
    paddingHorizontal: 16,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
