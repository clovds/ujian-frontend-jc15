import Axios from "axios";
import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import { api_url } from "../helpers/api_url";
import { connect } from "react-redux";
import { loginAction } from "../redux/action";
import { Redirect } from "react-router-dom";

class LoginPage extends Component {
  state = {
    loginInfo: {
      email: "",
      password: "",
    },
  };

  onChangeInput = (e) => {
    this.setState({
      loginInfo: {
        ...this.state.loginInfo,
        [e.target.id]: e.target.value,
      },
    });
  };

  clickLogin = () => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var PasswordRegex = /^(?=.*\d)(?=.*[a-z][a-zA-Z0-9]).{6,}$/;
    const { email, password } = this.state.loginInfo;
    if (email.match(emailRegex)) {
      if (password.match(PasswordRegex)) {
        Axios.get(`${api_url}/users?email=${email}&password=${password}`)
          .then((res) => {
            if (res.data.length !== 0) {
              this.props.loginAction(res.data[0]);
              localStorage.setItem("id", res.data[0].id);
              this.props.getCartActionById(res.data[0].id);
            } else {
              Axios.post(`${api_url}/users`, this.state.loginInfo)
                .then((res) => {
                  this.props.loginAction(res.data);
                  localStorage.setItem("id", res.data.id);
                })
                .catch((err) => {});
            }
          })
          .catch((err) => {});
      } else {
        alert("Password minimal 6 karakter dan menggandung 1 angka");
      }
    } else {
      alert("Format email salah");
    }
  };
  render() {
    if (this.props.emailUser !== "") {
      return <Redirect to="/" />;
    }
    const { email, password } = this.state.loginInfo;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "80vh",
        }}
      >
        <div>
          <h3>Nike-store</h3>
          <h6>Welcome Back, Please login or register.</h6>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            Height: "50vh",
          }}
        >
          <div className="my-2">
            {/* Email */}
            <Input
              size="40"
              placeholder="Email"
              type="email"
              id="email"
              onChange={this.onChangeInput}
              value={email}
            />
          </div>
          <div className="my-2">
            {/* Password */}
            <Input
              size="40"
              placeholder="Password"
              type="password"
              id="password"
              onChange={this.onChangeInput}
              value={password}
            />
          </div>
          <Button
            style={{
              width: "340px",
              backgroundColor: "#333333",
              border: "none",
              color: "#D6D6D6",
            }}
            className="my-2"
            onClick={this.clickLogin}
          >
            Login / Register
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    emailUser: state.user.email,
  };
};

export default connect(mapStateToProps, { loginAction })(LoginPage);
