import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

let navigator;
export const setTopLevelNavigator = navigatorRef => {
  navigator = navigatorRef;
};

export const navigationRef = React.createRef<NavigationContainerRef>();
export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};
