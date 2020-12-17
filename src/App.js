import React, { Component } from "react";
import { Route } from "react-router-dom";
import { NavigationBar } from "./components";
import { Landing, LoginPage, HistoryPage, cartPage } from "./pages";
import { keepLogin, getCartActionById } from "./redux/action";
import { connect } from "react-redux";

class App extends Component {
  state = {};
  componentDidMount() {
    const id = localStorage.getItem("id");
    if (id) {
      this.props.keepLogin(id);
      this.props.getCartActionById(id);
    }
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Route path="/" exact component={Landing} />
        <Route path="/login" component={LoginPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/cart" component={cartPage} />
      </div>
    );
  }
}

export default connect(null, { keepLogin, getCartActionById })(App);
