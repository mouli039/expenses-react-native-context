import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

interface IProps {}

interface IState {
  inputText: string;
  data: any;
  pic: string;
  colour: {backgroundColor: string};
}

class WheatherAPI extends Component<IProps, IState> {
  state: IState = {
    inputText: '',
    data: [],
    pic: '',
    colour: {
      backgroundColor: '',
    },
  };

  inputHandler = (e: string) => {
    this.setState({inputText: e});
  };

  checkWeather = async () => {
    const {inputText} = this.state;
    try {
      const data: any = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=9fdd2971212b4f3ca8192000230707&q=${inputText}`,
      );
      const res = await data.json();
      if (res.current.temp_c * 1 > -10) {
        if (res.current.temp_c * 1 > 20) {
          if (res.current.temp_c * 1 > 27) {
            if (res.current.temp_c * 1 < 29) {
              this.setState({
                pic: require(`./assets/two.png`),
                colour: {backgroundColor: '#DB8681'},
              });
            } else {
              this.setState({
                pic: require(`./assets/one.png`),
                colour: {backgroundColor: '#81A1DB'},
              });
            }
          } else {
            this.setState({
              pic: require(`./assets/three.png`),
              colour: {backgroundColor: '#472B97'},
            });
          }
        } else {
          this.setState({
            pic: require(`./assets/four.png`),
            colour: {backgroundColor: '#183655'},
          });
        }
      } else {
        this.setState({
          pic: require(`./assets/five.png`),
          colour: {backgroundColor: '#637281'},
        });
      }
      this.setState({data: res, inputText: ''});
    } catch {
      Alert.alert('please enter valid city name');
    }
  };

  async componentDidMount() {
    try {
      const data: any = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=9fdd2971212b4f3ca8192000230707&q=Vijayawada`,
      );
      const res = await data.json();
      this.setState({data: res});
    } catch {
      Alert.alert('please enter valid city name');
    }
  }

  render() {
    const {inputText, data, pic, colour} = this.state;
    const {inputHandler, checkWeather} = this;
    if (data.length === 0) {
      return <Text>Loading.....</Text>;
    }
    return (
      <KeyboardAvoidingView behavior="position">
        <ImageBackground
          resizeMode="stretch"
          source={pic === '' ? require(`./assets/one.png`) : pic}
          style={styles.backgroundImage}>
          <StatusBar backgroundColor="transparent" translucent={true} />
          <View style={styles.info}>
            <View>
              <View>
                <Text style={styles.temperature}>{data.current.temp_c} ํC</Text>
                <View>
                  <Text style={styles.longitude}>
                    wind : {data.current.wind_mph} mph / {data.current.wind_kph}{' '}
                    kph
                  </Text>
                  {/* <Text style={styles.latitude}>
                      wind : {data.current.wind_kph} kph
                    </Text> */}
                </View>
              </View>
              <View style={styles.details}>
                <Icon name="location-sharp" color="white" size={20} />
                <Text style={styles.location}>
                  {data.location.name}, {data.location.region}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.functionalSpace}>
            <View>
              <TextInput
                onChangeText={inputHandler}
                style={styles.input}
                value={inputText}
              />
              {colour.backgroundColor === '' ? (
                <Text style={styles.button} onPress={checkWeather}>
                  Enter
                </Text>
              ) : (
                <Text style={[styles.button, colour]} onPress={checkWeather}>
                  Enter
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

export default WheatherAPI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
  },
  info: {
    alignItems: 'flex-end',
    padding: 14,
    height: responsiveHeight(30),
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    color: 'white',
    fontSize: responsiveFontSize(5),
    fontWeight: '500',
    letterSpacing: 3,
    textAlign: 'right',
  },
  longitude: {
    color: 'white',
    textAlign: 'right',
  },
  latitude: {
    color: 'white',
    textAlign: 'right',
    marginBottom: 10,
  },
  location: {
    color: 'white',
    textAlign: 'right',
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 30,
    width: responsiveWidth(80),
    height: responsiveHeight(7),
    alignSelf: 'center',
    paddingHorizontal: 20,
    marginBottom: '14%',
  },
  functionalSpace: {
    height: responsiveHeight(50),
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  button: {
    textAlign: 'center',
    width: responsiveWidth(50),
    alignSelf: 'center',
    paddingVertical: 10,
    backgroundColor: '#81A1DB',
    borderRadius: 30,
    color: 'white',
    fontSize: responsiveFontSize(2),
  },
});
