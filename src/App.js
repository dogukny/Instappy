import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import Icon from 'react-native-vector-icons/Feather';
import MainScreen from './screens/Main';
import History from './screens/History';
import {withTheme} from 'react-native-paper';


const Bottom = createBottomTabNavigator();

function App(props) {
  return (
    <Bottom.Navigator
      screenOptions={({route}) => ({
        tabBarButton: props => <TouchableBounce {...props} />,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'download';
          } else if (route.name === 'History') {
            iconName = 'inbox';
          }
          return <Icon name={iconName} size={20} color={color} />;
        },
      })}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: props.theme.colors.primary,
        inactiveTintColor: 'gray',
        style: {
          height: 40,
        },
      }}>
      <Bottom.Screen name="Home" component={MainScreen} />
      <Bottom.Screen name="History" component={History} />
    </Bottom.Navigator>
  );
}

export default withTheme(App);
