import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { addToCartAction } from "../redux/action";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

class ProductModal extends Component {
  state = {
    isOpen: false,
    qty: 1,
    data: [],
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  notify = (qty, name) => {
    return toast.info(`${qty} ${name} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };

  cartNotYetAdded = () => {
    const { product, id } = this.props;
    let res = product.find((val) => {
      return val.id === id;
    });
    return (
      <div>
        <Button
          color="primary"
          onClick={this.addToCartBtn}
          disabled={res.stock === 0}
        >
          Add to Cart
        </Button>
        <Button className="mx-2" color="secondary" onClick={this.toggle}>
          Cancel
        </Button>
      </div>
    );
  };

  successBtn = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addToCartBtn = () => {
    const { product, id, addToCartAction, userID, cart } = this.props;

    let res = product.find((val) => {
      return val.id === id;
    });
    let data = {
      name: res.name,
      categoryID: res.categoryID,
      image: res.image,
      price: res.price,
      qty: this.state.qty,
      userID: userID,
    };
    let resCart = cart.find((val) => {
      return val.name === res.name;
    });
    if (resCart) {
      let tot = resCart.qty + this.state.qty;
      if (tot <= res.stock) {
        addToCartAction(data);
        this.toggle();
        this.notify(this.state.qty, res.name);
      } else {
        alert("Insufficient stock or some product is already in cart.");
      }
    } else {
      addToCartAction(data);
      this.toggle();
      this.notify(this.state.qty, res.name);
    }
  };

  increaseBtn = () => {
    const { qty } = this.state;
    this.setState({
      qty: qty + 1,
    });
  };

  decreaseBtn = () => {
    const { qty } = this.state;
    this.setState({
      qty: qty - 1,
    });
  };

  renderProductDetail = () => {
    const { product, id } = this.props;
    const { qty } = this.state;
    let res = product.find((val) => {
      return val.id === id;
    });

    return (
      <div className="d-flex">
        <div className="d-flex align-items-center mx-3">
          <img src={res.image} alt="" width="200px" />
        </div>
        <div>
          <div>
            <h6>Price: Rp. {res.price.toLocaleString()}</h6>
          </div>
          <div>
            <h6>Stock: {res.stock}</h6>
          </div>
          <div>
            <h6>Description:</h6>
            <div>{res.description}</div>
          </div>
          <div className="d-flex my-2">
            <div>
              <Button
                color="primary"
                size="sm"
                onClick={this.decreaseBtn}
                disabled={qty === 1}
              >
                -
              </Button>
            </div>
            <div className="mx-3">{qty}</div>
            <div>
              <Button
                color="primary"
                size="sm"
                onClick={this.increaseBtn}
                disabled={qty === res.stock}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderModal = () => {
    const { product, id, emailUser } = this.props;
    let res = product.find((val) => {
      return val.id === id;
    });
    if (emailUser === "") {
      return (
        <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Not login yet.</ModalHeader>
          <ModalBody>
            <div className="d-flex justify-content-center flex-column">
              <div>
                <h6>You must login first to buy.</h6>
              </div>
              <div>
                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
              </div>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      );
    } else {
      return (
        <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{res.name}</ModalHeader>
          <ModalBody>{this.renderProductDetail()}</ModalBody>
          <ModalFooter>{this.cartNotYetAdded()}</ModalFooter>
        </Modal>
      );
    }
  };

  render() {
    return (
      <div>
        <Button
          style={{ width: "200px" }}
          color="primary"
          onClick={this.toggle}
          outline
        >
          Add to cart
        </Button>
        {this.renderModal()}
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    product: state.product.productList,
    emailUser: state.user.email,
    userID: state.user.id,
    cart: state.cart.cart,
  };
};

export default connect(mapStateToProps, { addToCartAction })(ProductModal);
