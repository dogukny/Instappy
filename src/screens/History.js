import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import {
  Button,
  Snackbar,
  withTheme,
  Modal,
  Portal,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import {PERMISSIONS, request} from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import Strings from '../strings/Strings';
import {createStackNavigator} from '@react-navigation/stack';
let name = Strings.screenhistory;
import {SafeAreaView} from 'react-native-safe-area-context';

class History extends React.Component {
  state = {
    data: '',
    sonuc: '',
    visible: false,
    modalpp: '',
    photoPermission: 'false',
    userid: '',
    modalVisible: false,
    refreshing: false,
  };

  componentDidMount() {
    this._retrieveItem();
    this.props.navigation.setOptions({
      headerTitle: name,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <IconButton
            style={{paddingRight: 10}}
            onPress={this._retrieveItem}
            icon={'refresh'}
            size={24}
            color={this.props.theme.colors.text}
          />
          <IconButton
            style={{paddingRight: 10}}
            onPress={this._remover}
            icon={'delete-outline'}
            size={24}
            color={this.props.theme.colors.text}
          />
        </View>
      ),
    });
  }

  _retrieveItem = () => {
    AsyncStorage.getItem('photos').then(value => {
      let yenilenen = JSON.parse(value);
      yenilenen.shift();
      const uniq = new Set(yenilenen.map(e => JSON.stringify(e)));
      const res = Array.from(uniq).map(e => JSON.parse(e));
      this.setState({
        data: res,
        sonuc: 'ok',
        refreshing: false,
      });
    });
  };

  _remover = () => {
    let clean = [
      {
        id: '',
        pp: '',
      },
    ];
    AsyncStorage.setItem('photos', JSON.stringify(clean));
    this._retrieveItem();
  };

  _permissionCheck = () => {
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(response => {
      this.setState({photoPermission: response}, () => {
        if (this.state.photoPermission === 'granted') {
          this._download();
        } else {
          Alert.alert(Strings.error, Strings.permissionerr, [
            {text: Strings.ok},
          ]);
        }
      });
    });
  };

  _download = () => {
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: dirs.DownloadDir + '/Instappy/' + this.state.userid + '.jpg',
    })
      .fetch('GET', this.state.modalpp)
      .then(res => {
        this.setState({
          visible: true,
        });
      })
      .catch(error => {
        Alert.alert(Strings.error, Strings.checknet, [{text: Strings.ok}]);
      });
  };
  _hideModal = () => this.setState({modalVisible: false});

  render() {
    let dimensions = Dimensions.get('window');
    let imageWidth = dimensions.width;
    const {colors} = this.props.theme;
    const scheme = this.props.theme.dark;

    if (this.state.sonuc === 'ok') {
      return (
        <SafeAreaView style={{backgroundColor: colors.background, flex: 1}}>
          <StatusBar
            barStyle={scheme === true ? 'light-content' : 'dark-content'}
            backgroundColor={scheme === true ? colors.background : 'white'}
          />
          <FlatList
            contentContainerStyle={{
              alignSelf: 'flex-start',
            }}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.data}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({refreshing: true}, () => {
                    this._retrieveItem();
                  });
                }}
              />
            }
            renderItem={({item}) => (
              <View
                style={{
                  paddingLeft: 10,
                  paddingTop: 10,
                  alignItems: 'center',
                  backgroundColor: colors.background,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      modalVisible: true,
                      modalpp: item.pp,
                      userid: item.id,
                    });
                  }}>
                  <Image
                    source={{uri: item.pp}}
                    style={{
                      width: imageWidth * 0.21,
                      height: imageWidth * 0.21,
                      borderRadius: imageWidth * 0.1,
                      borderWidth: 1,
                      borderColor: colors.text,
                    }}
                  />
                </TouchableOpacity>

                <Text style={{color: colors.text}}>{item.id.substr(0, 9)}</Text>
              </View>
            )}
          />
          <Portal>
            <Modal
              visible={this.state.modalVisible}
              onDismiss={this._hideModal}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  transparent: true,
                }}>
                <Image
                  source={{uri: this.state.modalpp}}
                  style={{width: 350, height: 350}}
                />
                <View style={{flexDirection: 'row'}}>
                  <Button
                    icon="arrow-down"
                    onPress={() => {
                      this._permissionCheck();
                    }}
                    style={{paddingTop: 5}}>
                    {Strings.download}
                  </Button>
                  <Button
                    icon="close"
                    onPress={() => {
                      this.setState({
                        modalVisible: false,
                      });
                    }}
                    style={{paddingTop: 5}}>
                    {Strings.close}
                  </Button>
                </View>
              </View>
            </Modal>
            <Snackbar
              visible={this.state.visible}
              onDismiss={() => this.setState({visible: false})}
              action={{
                label: <Icon name={'x'} size={20} />,
                onPress: () => {
                  this.setState({
                    visible: false,
                  });
                },
              }}
              theme={{
                colors: {
                  accent: colors.primary,
                },
              }}
              style={{backgroundColor: colors.background}}>
              <Text style={{color: colors.primary}}>{Strings.snackbar}</Text>
            </Snackbar>
          </Portal>
        </SafeAreaView>
      );
    } else {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
  }
}

const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={withTheme(History)} />
    </Stack.Navigator>
  );
}

export default withTheme(App);
