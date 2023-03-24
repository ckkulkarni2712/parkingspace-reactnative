import React from 'react';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import {loadFeature, defineFeature} from 'jest-cucumber';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
const feature = loadFeature('./features/base.feature');
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import parkingSlice, {
  initializeParkingLot,
} from '../../App/Reducer/parkingSlice';
import Base from '../../App/Base';
const uuid = uuidv4();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
    }),
  };
});
let store: any;
defineFeature(feature, test => {
  test('User enters the number of spaces', ({given, when, then, and}) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <Base />
      </Provider>,
    );
    given('the user is on the home page', () => {
      expect(screen).toBeTruthy();
    });
    when('the user enters some input in the input field and submits', () => {
      const input = screen.getByPlaceholderText(
        'Enter the number of parking spaces',
      );
      const button = screen.getByTestId('submit-button');
      fireEvent.changeText(input, '5');
      expect(button).not.toBeDisabled();
    });
    and('the parking lot should be initialized with 10 spaces', () => {
      const button = screen.getByTestId('submit-button');
      fireEvent.press(button);
      store.dispatch(initializeParkingLot(5));
      expect(navigation.navigate).toBeCalled();
    });
  });
});
