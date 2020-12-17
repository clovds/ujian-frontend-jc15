import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Badge,
} from "reactstrap";
import { Link } from "react-router-dom";
import { logoutAction } from "../redux/action";
import { connect } from "react-redux";
import Cart from "../icon/cart.svg";

class NavigationBar extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  logOut = () => {
    localStorage.removeItem("id");
    this.props.logoutAction();
  };

  loginBtn = () => {
    const { email } = this.props;
    let username = email.split("@");
    if (this.props.email === "") {
      return (
        <div>
          <Link to="/login">
            <Button outline color="info" size="sm" className="mx-2">
              Log in
            </Button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="d-flex align-items-center">
          {this.cartBtn()}
          <div>
            <UncontrolledDropdown inNavbar>
              <DropdownToggle nav caret>
                {username[0]}
              </DropdownToggle>
              <DropdownMenu right>
                <Link to="/history" style={{ textDecoration: "none" }}>
                  <DropdownItem>History Transaction</DropdownItem>
                </Link>
                <DropdownItem onClick={this.logOut}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      );
    }
  };

  cartBtn = () => {
    const { cart } = this.props;
    return (
      <div className="mx-2">
        <Link to="./cart">
          <img src={Cart} alt="" width="30px" className="mx-1" />
          <Badge color="danger">{cart.length}</Badge>
          {/* <Button color="primary" size="sm" outline>
            Cart <Badge color="danger">{cart.length}</Badge>
          </Button> */}
        </Link>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">NikeStore</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar></Nav>
            <div className="mr-3">{this.loginBtn()}</div>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.id,
    email: state.user.email,
    cart: state.cart.cart,
  };
};

export default connect(mapStateToProps, { logoutAction })(NavigationBar);
