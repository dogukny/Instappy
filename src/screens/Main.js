import {View, StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {
  Button,
  TextInput,
  Paragraph,
  Dialog,
  Portal,
  withTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Strings from '../strings/Strings';
import {createStackNavigator} from '@react-navigation/stack';
import Download from '../screens/Download';
import Svg, {Path} from 'react-native-svg';
import SplashScreen from 'react-native-splash-screen'
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: '',
      username: '',
      dataurl: '',
      ppurl: '-',
      visible: false,
      photoPermission: 'denied',
    };
  }
  static navigationOptions = {
    headerShown: false,
  };

  componentDidMount() {
    SplashScreen.hide();

    let baslangic = [
      {
        id: '',
        pp: '',
      },
    ];
    AsyncStorage.getItem('photos').then(value => {
      if (value === null) {
        AsyncStorage.setItem('photos', JSON.stringify(baslangic));
      }
    });
  }

  _hideDialog = () => this.setState({visible: false});

  checkid() {
    let url = 'https://www.instagram.com/' + this.state.username + '/?__a=1';

    if (url !== '') {
      fetch(url)
        .then(res => res.json())
        .then(responseJson => {
          this.setState({
            ppurl: responseJson.graphql.user.profile_pic_url_hd,
          });
        })
        .then(() => {
          this.props.navigation.navigate('Download', {
            pp: this.state.ppurl,
            id: this.state.username,
          });
        })
        .catch(errormsg => {
          if (errormsg.toString() === 'TypeError: Network request failed') {
            this.setState({
              visible: true,
              message: Strings.checknet,
            });
          } else {
            this.setState({
              visible: true,
              message: Strings.incorrectusername,
            });
          }
        });
    }
  }

  control() {
    if (this.state.username === '') {
      this.setState({
        visible: true,
        message: Strings.usernameerror,
      });
    } else {
      this.checkid();
    }
  }

  render() {
    const {colors} = this.props.theme;
    const scheme = this.props.theme.dark;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <StatusBar
          barStyle={scheme === true ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <Svg
          width={'40%'}
          height={'20%'}
          viewBox="0 0 400 400"
          fill={colors.primary}>
          <Path d="M70.313 34.825C53.29 39.296 39.119 53.59 34.777 70.672c-1.501 5.905-1.816 250.395-.332 257.61 3.529 17.151 20.122 33.744 37.273 37.273 5.823 1.197 250.741 1.197 256.564 0 17.151-3.529 33.744-20.122 37.273-37.273 1.197-5.823 1.197-250.741 0-256.564-3.559-17.297-19.976-33.714-37.273-37.273-6.977-1.435-252.434-1.074-257.969.38m257.933 19.696c7.982 3.227 14.006 9.25 17.232 17.228l1.788 4.423v247.656l-1.788 4.423c-3.226 7.978-9.25 14.001-17.232 17.228l-4.418 1.787H76.172l-4.418-1.787c-7.982-3.227-14.006-9.25-17.232-17.228l-1.788-4.423-.21-121.484c-.141-81.799.056-122.761.602-125.391 1.841-8.858 7.779-17.099 14.96-20.763 7.656-3.906 2.582-3.769 133.477-3.607l122.265.151 4.418 1.787m-38.402 19.605c-32.063 10.531-25.7 56.733 7.812 56.733 37.605 0 38.798-56.104 1.216-57.173-3.891-.111-7.954.087-9.028.44m12.58 19.83c3.427 2.283 5.69 6.798 4.994 9.966-1.689 7.69-11.466 10.733-16.674 5.189-7.66-8.154 2.466-21.292 11.68-15.155m-115.705 9.114C90.51 117.698 62.29 239.449 142.578 293.508c57.899 38.985 138.226 9.176 157.742-58.536 20.502-71.136-41.3-142.894-113.601-131.902m17.764 36.406c2.808 1.967 3.321 5.99 3.325 26.086l.005 19.077 5.776-5.601c8.422-8.167 16.099-7.189 16.099 2.051 0 4.52-24.72 29.067-29.271 29.067-3.605 0-28.782-23.881-29.73-28.2-2.038-9.276 7.829-11.305 16.108-3.312l5.393 5.206v-19.698c0-20.705.35-23.07 3.71-25.027 2.046-1.192 6.652-1.003 8.585.351m-43.647 46.431c.51 1.701 2.147 4.693 3.639 6.647 3.357 4.398 3.363 4.321-.326 4.321-6.531 0-6.404-.565-6.161 27.321l.215 24.587 1.953.987c1.495.756 10.852.988 39.844.988s38.349-.232 39.844-.988l1.953-.987.215-24.587c.243-27.886.37-27.321-6.161-27.321-3.631 0-3.763-.576-.788-3.427 2.014-1.929 3.758-5.119 5.112-9.351.882-2.754 9.688 1.22 13.206 5.959 3.458 4.659 3.65 6.455 3.65 34.126v26.292l-2.058 4.132c-5.275 10.584-7.443 11.019-54.973 11.019s-49.698-.435-54.973-11.019l-2.058-4.132.004-26.213c.006-32.521.538-34.558 10.304-39.425 5.533-2.757 6.451-2.627 7.559 1.071" />
        </Svg>

        <Portal>
          <Dialog visible={this.state.visible} onDismiss={this._hideDialog}>
            <Dialog.Title>{Strings.error}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{this.state.message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._hideDialog}>{Strings.ok}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <TextInput
          label={'kullanıcı adı:'}
          placeholder={'kullanıcı adı:'}
          mode={'outlined'}
          onChangeText={username => {
            this.setState({username: username});
          }}
          style={styles.input}
        />
        <View style={{paddingTop: 10}}>
          <Button icon="image-search" onPress={() => this.control()}>
            Fotoğrafı Göster
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 250,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    textAlign: 'right',
    marginTop: 10,
    marginRight: 10,
    position: 'absolute',
  },
});

const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={withTheme(Main)}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Download"
        component={withTheme(Download)}
        options={({route}) => ({title: route.params.id})}
      />
    </Stack.Navigator>
  );
}

export default App;
