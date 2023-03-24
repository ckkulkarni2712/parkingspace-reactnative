import React from 'react';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import {loadFeature, defineFeature} from 'jest-cucumber';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
const feature = loadFeature('./features/parkingspace.feature');
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import parkingSlice, {
  addToParkingSpace,
  initializeParkingLot,
  removeParkingSpace,
} from '../../App/Reducer/parkingSlice';
import ParkingSpace from '../../App/ParkingSpace';
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
  test('Add a new parking space', ({given, when, then, and}) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <ParkingSpace />
      </Provider>,
    );
    given('that there is a Parking Space Component', () => {
      expect(screen).toBeDefined();
    });
    when('I click on the "Add Space" button', () => {
      const addButton = screen.getByTestId('add-parking-space-button');
      fireEvent.press(addButton);
      expect(store.dispatch(addToParkingSpace)).toBeCalled();
    });
    then(
      'a new parking space should be added to the list of available spaces',
      () => {
        expect(store.dispatch(addToParkingSpace)).toBeCalled();
      },
    );
  });
  test('Remove an existing parking space', ({given, when, then, and}) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <ParkingSpace />
      </Provider>,
    );
    given('that there is a Parking Space Component', () => {
      expect(screen).toBeDefined();
    });
    when('I click on the "Remove Space" button', () => {
      const removeButton = screen.getByTestId('remove-parking-space-button');
      fireEvent.press(removeButton);
    });
    then(
      'a parking space should be removed from the list of available spaces',
      () => {
        expect(store.dispatch(removeParkingSpace)).toBeCalled();
      },
    );
  });
  test('Register a parking lot', ({given, when, then, and}) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <ParkingSpace />
      </Provider>,
    );
    given('that there is a Parking Space Component', () => {
      expect(screen).toBeDefined();
    });
    and('I have selected a parking space', () => {
      const addButton = screen.getByTestId('add-parking-space-button');
      fireEvent.press(addButton);
      store.dispatch(addToParkingSpace);
      const screens = screen.getByTestId('parking-space-1');
    });
  });
});
