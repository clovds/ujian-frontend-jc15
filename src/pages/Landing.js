import React, { Component } from "react";
import { ProductCard } from "../components";
import { connect } from "react-redux";
import { fetchProductsAction } from "../redux/action";

class Landing extends Component {
  state = {};

  componentDidMount() {
    const { fetchProductsAction } = this.props;
    fetchProductsAction();
  }

  componentDidUpdate(prevProps, prevState) {
    const { cartList } = this.props;
    if (prevProps.cartList !== cartList) {
    }
  }

  renderProductList = () => {
    return this.props.productList.map((val, index) => {
      return (
        <div className="mx-2 mb-4" key={index}>
          <ProductCard
            image={val.image}
            name={val.name}
            price={val.price}
            id={val.id}
          />
        </div>
      );
    });
  };

  render() {
    return (
      <div className="d-flex justify-content-center my-5">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {this.renderProductList()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productList: state.product.productList,
    cartList: state.cart.cart,
  };
};

export default connect(mapStateToProps, {
  fetchProductsAction,
})(Landing);
