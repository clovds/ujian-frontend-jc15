import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button } from "reactstrap";
import {
  getCartActionById,
  deleteCartAction,
  increaseQty,
  decreaseQty,
  checkoutAction,
  fetchProductsAction,
} from "../redux/action";
import Swal from "sweetalert2";

class CartPage extends Component {
  state = {};

  componentDidMount() {
    const { getCartActionById, userID, fetchProductsAction } = this.props;
    getCartActionById(userID);
    fetchProductsAction();
  }

  deleteBtn = (id, userID) => {
    const { deleteCartAction } = this.props;
    deleteCartAction(id, userID);
  };

  increaseQty = (name, qty, id) => {
    const { increaseQty, userID } = this.props;
    increaseQty(name, qty, id, userID);
  };

  decreaseQty = (name, qty, id) => {
    const { decreaseQty, userID } = this.props;
    decreaseQty(name, qty, id, userID);
  };

  renderTable = () => {
    const { cart } = this.props;
    return cart.map((val, id) => {
      return (
        <tr key={val.id}>
          <td>{val.id}</td>
          <td>{val.name}</td>
          <td>
            <img src={val.image} alt="" width="50px" />
          </td>
          <td className="d-flex justify-content-center align-items-center">
            <Button
              size="sm"
              color="primary"
              onClick={() => this.decreaseQty(val.name, val.qty, val.id)}
            >
              -
            </Button>
            <div className="mx-3">{val.qty}</div>
            <Button
              size="sm"
              color="primary"
              onClick={() => this.increaseQty(val.name, val.qty, val.id)}
            >
              +
            </Button>
          </td>
          <td>Rp. {val.price.toLocaleString()}</td>
          <td>
            <Button
              color="danger"
              onClick={() => this.deleteBtn(val.id, val.userID)}
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  };

  grandTotal = () => {
    const { cart } = this.props;
    let total = 0;
    cart.forEach((val) => {
      return (total += val.qty * val.price);
    });
    return total;
  };

  checkOut = () => {
    const { cart, userID, checkoutAction, products } = this.props;
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let idProductArr = cart.map((val) => {
      return products.find((value) => {
        return value.name === val.name;
      });
    });

    const data = {
      date: `${day}/${month}/${year}`,
      total: this.grandTotal(),
      items: cart,
      userID: userID,
    };
    checkoutAction(data, idProductArr);
  };

  checkOutAlert = () => {
    Swal.fire({
      title: "Are you sure want to checkout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Checkout Done", "", "success");
        this.checkOut();
      }
    });
  };

  render() {
    const { cart } = this.props;
    if (cart.length === 0) {
      return (
        <div className="d-flex justify-content-center my-5">
          <h1>Your cart is empty</h1>
        </div>
      );
    } else {
      return (
        <div>
          <Table style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>id</th>
                <th>Name</th>
                <th>Image</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderTable()}</tbody>
            <tfoot>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <h5>Grand Total:</h5>
              </td>
              <td>Rp. {this.grandTotal().toLocaleString()}</td>
              <td>
                <Button color="success" onClick={this.checkOutAlert}>
                  Check out
                </Button>
              </td>
            </tfoot>
          </Table>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
    userID: state.user.id,
    products: state.product.productList,
  };
};

export default connect(mapStateToProps, {
  getCartActionById,
  deleteCartAction,
  increaseQty,
  decreaseQty,
  checkoutAction,
  fetchProductsAction,
})(CartPage);
