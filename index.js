import 'react-native-gesture-handler';

import * as React from 'react';
import {AppRegistry} from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDark,
  DefaultTheme as PaperDefault,
} from 'react-native-paper';
import App from './src/App';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';

const lightPaper = {
  ...PaperDefault,
  colors: {
    ...PaperDefault.colors,
    primary: 'purple',
  },
};

export default function Main() {
  const scheme = useColorScheme();
  return (
    <PaperProvider theme={scheme === 'light' ? lightPaper : PaperDark}>
      <NavigationContainer
        theme={scheme === 'light' ? DefaultTheme : DarkTheme}>
        <App />
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent('instappy', () => Main);
