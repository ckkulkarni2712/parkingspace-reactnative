import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToParkingSpace,
  occupyParkingLots,
  removeParkingSpace,
} from './Reducer/parkingSlice';
const ParkingSpace = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useDispatch();
  const numspaces = useSelector((state: any) => state.parkingSpaces.numSpaces);
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [registration, setReg] = useState<string>('');
  const [parkingTime, setTime] = useState<Date>(new Date());
  const [selectedSpace, setSelected] = useState<number>(0);
  const [activatePayment, setActivation] = useState<boolean>(false);
  const spaces = useSelector((state: any) => state.parkingSpaces.spaces);
  const [showPicker, setPicker] = useState(false);
  const [displaySpaces, setDisplay] = useState(() => {
    const renderSpaces = [];
    for (let i = 1; i <= numspaces; i++) {
      renderSpaces.push(i);
    }
    return renderSpaces;
  });
  useEffect(() => {
    const renderSpaces = [];
    for (let i = 1; i <= numspaces; i++) {
      renderSpaces.push(i);
    }
    setDisplay(renderSpaces);
  }, [numspaces]);
  const handleIncrement = () => {
    dispatch(addToParkingSpace());
  };
  const handleDecrement = () => {
    dispatch(removeParkingSpace());
  };
  const handleSpaceClick = (space: number) => {
    if (spaces[space]) {
      navigation.navigate('Payment', {
        spaceDetails: spaces[space],
        space: space,
      });
    }
    setSelected(space);
    setDisplayForm(true);
  };
  const handleSubmit = () => {
    dispatch(
      occupyParkingLots({
        spaceNum: selectedSpace,
        registration: registration,
        parkingTime: parkingTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      }),
    );
    setSelected(0);
    setReg('');
    setTime(new Date());
  };
  const handleRegistration = (text: string) => {
    setReg(text);
  };
  const setParkingTime = (selectedTime: Date) => {
    setTime(selectedTime);
  };
  const hidePicker = () => {
    setPicker(false);
  };
  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={true}>
      <TouchableOpacity
        testID="add-parking-space-button"
        style={styles.buttonStyling1}
        onPress={handleIncrement}>
        <Text>Create New Parking</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="remove-parking-space-button"
        onPress={handleDecrement}
        style={styles.buttonStyling2}>
        <Text>Remove Parking Space</Text>
      </TouchableOpacity>
      {displaySpaces.map(space => (
        <TouchableOpacity
          testID={`parking-space-${space}`}
          onPress={() => handleSpaceClick(space)}
          key={space}
          style={styles.parkingSpace}>
          <Text>{space}</Text>
          {spaces[space] && (
            <View>
              <Text>Registration: {spaces[space].registration}</Text>
              <Text>Parking Time: {spaces[space].parkingTime}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
      {displayForm && (
        <View style={styles.formContainer}>
          <DateTimePickerModal
            isVisible={showPicker}
            mode="time"
            onConfirm={setParkingTime}
            onCancel={() => hidePicker()}
          />
          <Text testID="parking-time-label">Parking Time (tap to change)</Text>
          <TouchableOpacity
            style={styles.setTimeButton}
            onPress={() => {
              setPicker(true);
            }}
            testID="change-time-button">
            <Text testID="parking-time">
              {parkingTime.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          <Text testID="car-registration-label">Car Registration</Text>
          <TextInput
            placeholder="Enter vehicle registration"
            onChangeText={handleRegistration}
            style={styles.formInput}
            testID="vehicle-registration-input"
          />
          <TouchableOpacity
            testID="submit-button"
            onPress={() => handleSubmit()}
            style={styles.buttonStyling3}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonStyling3}
            onPress={() => {
              setSelected(0);
              handleRegistration('');
              setParkingTime(new Date());
              setDisplayForm(false);
            }}
            testID="close-button">
            <Text style={{color: 'white'}}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ParkingSpace;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#F5EFEF',
  },
  parkingSpace: {
    width: 110,
    backgroundColor: '#EFEFEF',
    height: 85,
    borderWidth: 2.5,
    borderStyle: 'dotted',
    borderColor: '#49C78C',
    margin: 5,
    marginHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  parkingNumber: {
    fontSize: 20,
  },
  buttonStyling1: {
    top: 0,
    position: 'absolute',
    padding: 10,
    backgroundColor: '#E1EDF8',
    left: 50,
  },
  buttonStyling2: {
    top: 0,
    right: 10,
    position: 'absolute',
    padding: 10,
    backgroundColor: '#E1EDF8',
  },
  formInput: {
    marginTop: 7,
    width: '100%',
    height: 33,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 7,
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1,
  },
  buttonStyling3: {
    marginTop: 5,
    backgroundColor: '#0551B4',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    borderRadius: 5,
  },
  setTimeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 5,
  },
  spaceDetails: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0551B4',
    padding: 25,
  },
});
