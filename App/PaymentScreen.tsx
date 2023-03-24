import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {paymentComplete} from './Reducer/parkingSlice';

const PaymentScreen = ({route}: any) => {
  const dispatch = useDispatch();
  const {spaceDetails, space} = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [hoursParked, setHoursParked] = useState<number | null>(null);
  useEffect(() => {
    const [parkingHours, parkingMinutes] = spaceDetails.parkingTime.split(':');
    const parkedTime = new Date();
    parkedTime.setHours(Number(parkingHours), Number(parkingMinutes), 0, 0);
    const hoursParked = Math.ceil(
      (new Date().getTime() - parkedTime.getTime()) / (1000 * 60 * 60) - 1,
    );
    setHoursParked(hoursParked);
  }, [spaceDetails.parkingTime]);
  const calculateParkingCharges = (parkingTime: any) => {
    const [parkingHours, parkingMinutes] = parkingTime.split(':');
    const parkedTime = new Date();
    parkedTime.setHours(Number(parkingHours), Number(parkingMinutes), 0, 0);
    const hoursParked = Math.ceil(
      (new Date().getTime() - parkedTime.getTime()) / (1000 * 60 * 60),
    );
    let parkingCharge = 10;
    if (hoursParked > 2) {
      parkingCharge += (hoursParked - 2) * 10 - 10;
    }
    return parkingCharge;
  };

  const [payment, setPayment] = useState(
    calculateParkingCharges(spaceDetails.parkingTime),
  );
  const handleSubmit = async () => {
    const reg = spaceDetails.registration;
    const charges = payment;
    try {
      const result = await fetch(`https://httpstat.us/200`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'car-registration': reg,
          charge: charges,
        }),
      });
      if (result.ok) {
        Alert.alert('Payment Successful!');
        dispatch(paymentComplete(space));
        navigation.navigate('Parking Spaces');
      } else {
        Alert.alert('Payment Failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Button
        color="#0551B4"
        title="Go Back"
        onPress={() => {
          navigation.goBack();
        }}
        testID="deregester-back"
      />

      <View style={styles.details}>
        <Text style={styles.textStyle}>
          Car Registration: {spaceDetails.registration}
        </Text>
        <Text testID="deregester-time-spent" style={styles.textStyle}>
          Time Spent: {hoursParked}
        </Text>
        <Text testID="deregester-charge">Parking Charges: ${payment}</Text>
      </View>
      <View style={styles.buttonStyle1}>
        <Button
          color="#0551B4"
          title="Payment Taken"
          onPress={handleSubmit}
          testID="deregester-payment-button"
        />
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    borderWidth: 2,
    borderColor: '#CBD8F5',
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    color: 'black',
  },
  buttonStyle1: {
    paddingTop: 10,
  },
  buttonStyle2: {
    paddingBottom: 10,
    width: 100,
  },
  textStyle: {
    borderBottomColor: '#EFF2FB',
    borderBottomWidth: 1.3,
    paddingBottom: 3,
  },
});
