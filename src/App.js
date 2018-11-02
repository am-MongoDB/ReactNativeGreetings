const React = require('react');
const { Button, StyleSheet, Text, TextInput, View } = require('react-native');
const { Stitch, AnonymousCredential } = require('mongodb-stitch-react-native-sdk');
const MongoDB = require('mongodb-stitch-react-native-services-mongodb-remote');


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      currentUserId: undefined,
      client: undefined,
      atlasClient: undefined,
      db: undefined,
      collection: undefined,
      tempName: undefined,
      name: undefined,
      welcomeText: undefined
    };
    this._loadClient = this._loadClient.bind(this);
    this._onPressLogin = this._onPressLogin.bind(this);
    this._onPressLogout = this._onPressLogout.bind(this);
    this._onPressName = this._onPressName.bind(this);
  }

  componentDidMount() {
    this._loadClient();
  }

  render() {
    let loginStatus = "Currently logged out."

    if(this.state.currentUserId) {
      loginStatus = `Currently logged in as ${this.state.currentUserId}!`
    }

    loginButton = <Button
                    onPress={this._onPressLogin}
                    title="Login"/>

    logoutButton = <Button
                    onPress={this._onPressLogout}
                    title="Logout"/>
    nameInput = <TextInput
                  placeholder="Type your name here..."
                  onChangeText={(text) => this.setState({tempName: text})}/>
    confirmNameButton = <Button
                          onPress={this._onPressName}
                          title="Confirm Name"
                        />

    return (
      <View style={styles.container}>
        <Text> {loginStatus} </Text>
        {this.state.currentUserId !== undefined ? logoutButton : loginButton}
        {this.state.name !== undefined ? <Text>{this.state.welcomeText}</Text> : this.state.currentUserId !== undefined ? nameInput : ""}
        {(this.state.name == undefined) && (this.state.tempName !== undefined) ? confirmNameButton : "" }
      </View>
    );
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('new_greeting-zethi').then(client => {
      this.setState({ client });
      const dbClient = client.getServiceClient(MongoDB.RemoteMongoClient.factory, "mongodb-atlas");
      this.setState({atlasClient : dbClient});
      this.setState({db : dbClient.db("greetings")});
      if(client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id })
      }
    });
  }

  _onPressLogin() {
    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        console.log(`Successfully logged in as user ${user.id}`);
        this.setState({ currentUserId: user.id })
    }).catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined })
    });
  }

  _onPressLogout() {
    this.state.client.auth.logout().then(user => {
        console.log(`Successfully logged out`);
        this.setState({tempName: undefined})
        this.setState({name: undefined})
        this.setState({currentUserId: undefined})
        this.setState({welcomeText: undefined})
        this.setState({tempName: undefined})
    }).catch(err => {
        console.log(`Failed to log out: ${err}`);
        this.setState({ currentUserId: undefined })
    });
  }

  _onPressName() {
      this.setState({ name: this.state.tempName });
      const collection = this.state.db.collection("names");
      collection.find({owner_id: this.state.currentUserId}, {limit: 1}).first().then(foundDoc => {
        if (foundDoc) {
          collection.updateOne(
            {owner_id: this.state.currentUserId}, 
            {owner_id: this.state.currentUserId, name: this.state.tempName}).then(result => {
                this.state.client.callFunction("welcome").then(welcomeMessage => {
                this.setState({welcomeText: welcomeMessage});
              })
            })
        } else {
          collection.insertOne(
          {owner_id: this.state.currentUserId, 
           name: this.state.tempName}).then(result => {
                this.state.client.callFunction("welcome").then(welcomeMessage => {
                this.setState({welcomeText: welcomeMessage});
              })
            })
        }
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

