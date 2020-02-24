import LocalizedStrings from 'react-native-localization';

let Strings = new LocalizedStrings({
  en: {
    downloadbutton: 'SHOW PHOTO',
    placeholder: 'username',
    placeholderx: 'username...',
    download: 'Download',
    snackbar: 'Downloaded to Download/Instappy folder',
    screenhistory: 'History',
    close: 'Close',
    error: 'Error',
    checknet: 'Check your internet connection',
    usernameerror: 'Please enter username',
    ok: 'OK',
    incorrectusername: 'Incorrect username',
    permissionerr: 'Storage permission required to download photo',
  },
  tr: {
    downloadbutton: 'FOTOĞRAFI GÖSTER',
    placeholder: 'kullanıcı adı',
    placeholderx: 'kullanıcı adı...',
    download: 'Indir',
    snackbar: 'Downloads/Instappy klasörüne indirildi',
    screenhistory: 'Geçmiş',
    close: 'Kapat',
    error: 'Hata',
    checknet: 'İnternet bağlantınızı kontrol edin',
    usernameerror: 'Lütfen kullanıcı adı girin',
    ok: 'Tamam',
    incorrectusername: 'Hatalı kullanıcı adı',
    permissionerr: 'İndirmek için depolama izni gerekli',
  },
});

export default Strings;
