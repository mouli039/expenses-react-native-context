import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IProps {}
interface IState {
  incTitle: string;
  incAmount: any;
  incTitleError: boolean;
  incAmountError: boolean;
  modalAdd: boolean;
  inc: boolean;
  expense: {}[];
}

export class MainPage extends Component<IProps, IState> {
  state: IState = {
    incTitle: '',
    incAmount: '',
    incTitleError: false,
    incAmountError: false,
    modalAdd: false,
    expense: [],
    inc: false,
  };
  addAmount = () => {
    this.setState({modalAdd: !this.state.modalAdd, inc: true});
  };
  payAmount = () => {
    this.setState({modalAdd: !this.state.modalAdd, inc: false});
  };
  incTitleHandler = (e: string) => {
    this.setState({incTitle: e});
  };
  incAmountHandler = (e: string) => {
    this.setState({incAmount: e});
  };

  pay = () => {
    const {incAmount, incTitle, expense} = this.state;
    const money = expense?.reduce(
      (acc: any, ele: any) =>
        ele.inc ? ele.amount * 1 + acc : acc - ele.amount * 1,
      0,
    );
    if (incAmount > money ){
      Alert.alert('Insufficient funds')
    }
    else if ((incAmount*1) < 0){

      if (incTitle.trim() !== '') {
        if (incAmount.trim() !== '') {
          const time = `${new Date().getHours()} : ${new Date().getMinutes()} : ${new Date().getSeconds()}`;
          const transaction = {
            title: incTitle,
            amount: incAmount,
            time: time,
            inc: false,
          };
          AsyncStorage.setItem(
            'expense',
            JSON.stringify([...expense, transaction]),
          );
          this.setState({
            incAmount: '',
            incTitle: '',
            expense: [...expense, transaction],
            modalAdd: false,
            inc: false,
          });
        } else {
          this.setState({incAmountError: true});
        }
      } else {
        this.setState({incTitleError: true});
      }
    }
  };

  add = () => {
    const {incAmount, incTitle, expense} = this.state;
    if ((incAmount*1) < 0){

      if (incTitle.trim() !== '') {
        if (incAmount.trim() !== '') {
          const time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
          const transaction = {
            title: incTitle,
            amount: incAmount,
            time: time,
            inc: true,
          };
          AsyncStorage.setItem(
            'expense',
            JSON.stringify([...expense, transaction]),
          );
          this.setState({
            incAmount: '',
            incTitle: '',
            expense: [...expense, transaction],
            modalAdd: false,
            inc: false,
          });
        } else {
          this.setState({incAmountError: true});
        }
      } else {
        this.setState({incTitleError: true});
      }
    }
    else{
      Alert.alert('pora pu......')
    }
  };

  async componentDidMount() {
    const data = await AsyncStorage.getItem('expense');
    data === null
      ? AsyncStorage.setItem('expense', JSON.stringify([]))
      : this.setState({expense: JSON.parse(data)});
  }
  render() {
    const {
      incAmount,
      incAmountError,
      incTitle,
      incTitleError,
      modalAdd,
      expense,
      inc,
    } = this.state;
    const {addAmount, incTitleHandler, incAmountHandler, add, payAmount, pay} =
      this;
    const money = expense?.reduce(
      (acc: any, ele: any) =>
        ele.inc ? ele.amount * 1 + acc : acc - ele.amount * 1,
      0,
    );
    const date = new Date();
    const month = date.toLocaleString('default', {month: 'long'});
    return (
      <View style={styles.container}>
        <Modal animationType="slide" transparent={true} visible={modalAdd}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={styles.modalContainer}>
              <Icon
                name="chevron-back-circle-outline"
                size={30}
                color="white"
                onPress={addAmount}
              />
              <View style={styles.field}>
                <Text style={styles.inputTitle}>Title</Text>
                <TextInput
                  onChangeText={incTitleHandler}
                  style={styles.textInput}
                  value={incTitle}
                  placeholder="Enter the Title"
                />
                <Text style={styles.helperText}>
                  {incTitleError && 'name cant be empty'}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.inputTitle}>Amount</Text>
                <TextInput
                  onChangeText={incAmountHandler}
                  style={styles.textInput}
                  keyboardType="decimal-pad"
                  value={incAmount}
                  placeholder="Enter the Amount"
                />
                <Text style={styles.helperText}>
                  {incAmountError && "amount can't be empty"}
                </Text>
              </View>
              {inc ? (
                <TouchableOpacity style={styles.button} onPress={add}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={pay}>
                  <Text style={styles.buttonText}>Pay</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
        <View style={[styles.row, styles.header]}>
          <Icon name="home-outline" size={25} color="white" />
          <Text style={styles.headerText}>Wallet</Text>
          <Icon name="notifications-outline" size={25} color="white" />
        </View>
        <View style={styles.content}>
          <Text style={styles.amountText}>Total Balance</Text>
          <Text style={styles.amount}>{`$ ${
            money === null ? null : money
          }.00`}</Text>
          <View style={[styles.row, styles.methods]}>
            <View style={styles.eachMethod}>
              <View style={styles.iconBorder}>
                <Icon
                  name="add-sharp"
                  size={30}
                  onPress={addAmount}
                  color="#429690"
                />
              </View>
              <Text style={styles.methodText}>Add</Text>
            </View>
            <View style={styles.eachMethod}>
              <View style={styles.iconBorder}>
                <Icon
                  name="qr-code-sharp"
                  size={30}
                  onPress={payAmount}
                  color="#429690"
                />
              </View>
              <Text style={styles.methodText}>Pay</Text>
            </View>
            <View style={styles.eachMethod}>
              <View style={styles.iconBorder}>
                <Icon name="send-sharp" size={30} color="#429690" />
              </View>
              <Text style={styles.methodText}>Send</Text>
            </View>
          </View>
          <View style={[styles.row, styles.menu]}>
            <Text style={styles.menu1}>Transactions</Text>
            <Text style={styles.menu2}>Upcoming Bills</Text>
          </View>
          <View style={styles.transactions}>
            <FlatList
              data={expense.reverse()}
              keyExtractor={(item: any) => item.time}
              renderItem={({item}: any) => (
                <View style={[styles.row, styles.transaction]}>
                  <Icon
                    name="person-circle-sharp"
                    size={35}
                    style={styles.transactionIcon}
                  />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionTime}>{item.time}</Text>
                  </View>
                  {item.inc ? (
                    <Text style={styles.price}>{`+ $ ${item.amount}.00`}</Text>
                  ) : (
                    <Text style={styles.price1}>{`- $ ${item.amount}.00`}</Text>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default MainPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#429690',
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
  amountText: {
    textAlign: 'center',
    marginTop: 40,
  },
  amount: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 10,
    color: 'black',
  },
  methods: {
    justifyContent: 'center',
    gap: 30,
    marginTop: 50,
  },
  eachMethod: {
    alignItems: 'center',
  },
  iconBorder: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 60,
    alignSelf: 'center',
    borderColor: '#429690',
  },
  methodText: {
    marginTop: 10,
    color: 'black',
  },
  menu: {
    width: '85%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
    gap: 5,
  },
  menu1: {
    backgroundColor: 'white',
    width: '50%',
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 60,
    elevation: 5,
  },
  menu2: {
    backgroundColor: '#F4F6F6',
    width: '50%',
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 60,
    elevation: 5,
  },
  transactions: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  transaction: {
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  transactionDetails: {
    width: '50%',
  },
  transactionIcon: {
    alignSelf: 'flex-start',
    width: '10%',
    justifyContent: 'center',
  },
  transactionTitle: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
  },
  transactionTime: {
    fontSize: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: 'green',
    textAlign: 'right',
    width: '30%',
  },
  price1: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
    color: 'red',
    width: '30%',
  },
  modalContainer: {
    alignSelf: 'center',
    width: '85%',
    height: 350,
    borderRadius: 60,
    padding: 30,
    backgroundColor: '#429690',
  },
  textInput: {
    borderRadius: 100,
    backgroundColor: 'white',
    marginHorizontal: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  helperText: {
    color: 'red',
    paddingHorizontal: 20,
  },
  field: {
    height: 90,
    backgroundColor: 'transparent',
    marginBottom: 5,
  },
  inputTitle: {
    paddingHorizontal: 20,
    fontSize: 20,
    color: 'white',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  button: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    marginVertical: 20,
  },
  buttonText: {
    paddingHorizontal: 20,
    color: 'black',
  },
});
