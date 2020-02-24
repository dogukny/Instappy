import {View, Image, Alert, Text} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  ActivityIndicator,
  Snackbar,
  Button,
  Dialog,
  Portal,
  Paragraph,
} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Feather';
import Strings from '../strings/Strings';
import {PERMISSIONS, request} from 'react-native-permissions';

export default class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pp: '',
      userid: '',
      photoPermission: 'denied',
      visible: false,
      dvisible: false,
      message: '',
    };
  }
  componentDidMount(prevProps, prevState) {

    this.setState(
      {
        pp: this.props.route.params?.pp,
        userid: this.props.route.params?.id,
      },
      () => {
        let gelen = [];
        AsyncStorage.getItem('photos').then(value => {
          if (value !== null) {
            gelen = JSON.parse(value); // you could do some additional checks to make sure it is an array
            gelen.push({
              id: this.state.userid,
              pp: this.state.pp,
            });
            AsyncStorage.setItem('photos', JSON.stringify(gelen));
          }
        });
      },
    );
  }

  _hideDialog = () => this.setState({dvisible: false});

  _permissionCheck = () => {
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(response => {
      this.setState({photoPermission: response}, () => {
        if (this.state.photoPermission === 'granted') {
          this._download();
        } else {
          this.setState({
            dvisible: true,
            message: Strings.permissionerr,
          });
        }
      });
    });
  };

  _download() {
    let dirs = RNFetchBlob.fs.dirs;
    let promise = RNFetchBlob.config({
      path: dirs.DownloadDir + '/Instappy/' + this.state.userid + '.jpg',
    })
      .fetch('GET', this.state.pp)
      .then(() => {
        this.setState(
          {
            visible: true,
          }
        );
      })
      .catch(error => {
        this.setState({
          dvisible: true,
          message: Strings.checknet,
        });
      });
  }

  render() {
    const {colors} = this.props.theme;

    if (this.state.pp) {
      return (
        <View
          style={{
            backgroundColor: colors.background,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: this.state.pp}}
            style={{
              height: 350,
              width: 350,
            }}
          />

          <Button
            icon="download"
            onPress={() => {
              this._permissionCheck();
            }}>
            {Strings.download}
          </Button>
          <Portal>
            <Dialog visible={this.state.dvisible} onDismiss={this._hideDialog}>
              <Dialog.Title>{Strings.error}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{this.state.message}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={this._hideDialog}>{Strings.ok}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Snackbar
            visible={this.state.visible}
            onDismiss={() => this.setState({visible: false})}
            action={{
              label: <Icon name={'x'} size={20} color={colors.primary} />,
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
        </View>
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
