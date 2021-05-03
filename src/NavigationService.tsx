import * as React from 'react';

let navigator;
export const setTopLevelNavigator = navigatorRef => {
  navigator = navigatorRef;
};

export const navigationRef = React.createRef();
export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};
