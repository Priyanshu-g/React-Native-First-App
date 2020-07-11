import { StatusBar } from "expo-status-bar";
import React, { Component, isValidElement } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import { render } from "react-dom";
import { Icon, Input } from "react-native-elements";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      search: "",
      newSet: [],
      homePage: false,
      myAccountPage: false,
      profilePic: "",
    };
  }

  componentDidMount() {
    return fetch("https://invitation.codes/api/ext/v1/sites.json")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          dataSource: Object.values(responseJson.prods),
          homePage: true,
        });
      })
      .catch((error) => console.log(error));
  }

  renderProducts() {
    const { dataSource } = this.state;
    let search = this.state.search;
    let newSet = dataSource.filter(
      (listItem) =>
        String(listItem.name).includes(search) ||
        String(listItem.slug).includes(search)
    );
    return newSet.map((val, key) => {
      const iconUrl = val.icon;
      if (iconUrl != null) {
        let image = { uri: iconUrl };
        return (
          <View
            key={val.slug}
            style={styles.cell}
            class="referralcodecell"
            id={val.name}
          >
            <Image style={styles.image} source={image}></Image>
            <Text style={styles.gap}></Text>
            <View style={styles.column}>
              <Text style={styles.text}>Name: {val.name}</Text>
              <Text style={styles.text}>Code: {val.slug}</Text>
              <Text
                style={styles.textUnder}
                onPress={() => Linking.openURL(val.urlAbsolute)}
              >
                URL: {val.urlAbsolute}
              </Text>
            </View>
          </View>
        );
      } else {
        return (
          <View
            key={val.slug}
            style={styles.cell}
            class="referralcodecell"
            id={val.name}
          >
            <View style={styles.column}>
              <Text style={styles.text}>Name: {val.name}</Text>
              <Text style={styles.text}>Code: {val.slug}</Text>
              <Text
                style={styles.textUnder}
                onPress={() => Linking.openURL(val.urlAbsolute)}
              >
                URL: {val.urlAbsolute}
              </Text>
            </View>
          </View>
        );
      }
    });
  }

  render() {
    const { loading } = this.state;
    const { homePage } = this.state;
    const { myAccountPage } = this.state;

    if (loading) {
      return (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      );
    }

    if (homePage) {
      return (
        <View style={styles.background}>
          <View style={styles.search}>
            <Input
              inputStyle={styles.text}
              placeholder="INPUT WITH CUSTOM ICON"
              leftIcon={<Icon name="search" color="#FFF" type="material" />}
              onChangeText={(search) => {
                this.setState({ search });
              }}
            />
          </View>

          <ScrollView>
            <View>{this.renderProducts()}</View>
          </ScrollView>

          <View>
            <Icon
              style={styles.accountButton}
              size={50}
              name="account-circle"
              color="#000"
              type="material"
              onPress={() =>
                this.setState({ homePage: false, myAccountPage: true })
              }
            />
          </View>
        </View>
      );
    }
    if (myAccountPage) {
      return (
        <View style={styles.background}>
          <Icon
            style={styles.goBack}
            size={50}
            name="navigate-before"
            color="#000"
            type="material"
            onPress={() =>
              this.setState({ homePage: true, myAccountPage: false })
            }
          />
          <Image style={styles.pfp} source={this.state.profilePic}></Image>
          <Icon
            style={{ alignSelf: "center" }}
            size={50}
            name="add-circle"
            color="#000"
            type="material"
            /*
            onPress={() =>
              this.setState({ homePage: true, myAccountPage: false })
            }
            */
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#8D2828",
    color: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  pfp: {
    borderRadius: 5,
    borderWidth: 5,
    height: 200,
    width: 200,
    alignSelf: "center",
  },
  accountButton: {
    alignSelf: "flex-end",
  },
  background: {
    backgroundColor: "#8D2828",
    flex: 1,
    paddingTop: 20,
  },
  goBack: {
    alignSelf: "flex-start",
  },
  cell: {
    margin: 10,
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 10,
    flexDirection: "row",
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  search: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#000",
    borderRadius: 10,
    flexDirection: "row",
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  column: {
    flexDirection: "column",
    flex: 1,
  },
  text: {
    color: "#FFF",
    fontSize: 20,
    flexWrap: "wrap",
    fontWeight: "200",
  },
  textUnder: {
    color: "#FFF",
    fontSize: 20,
    flexWrap: "wrap",
    fontWeight: "200",
    textDecorationLine: "underline",
  },
  image: {
    resizeMode: "stretch",
    height: 50,
    width: 50,
  },
  gap: {
    margin: 5,
  },
});
