import Axios from "axios";
import Swal from "sweetalert2";
import { api_url } from "../../helpers/api_url";

export const getCartActionById = (id) => {
  return (dispatch) => {
    Axios.get(`${api_url}/cart?userID=${id}`)
      .then((res) => {
        console.log(res);
        dispatch({
          type: "FETCH_CART",
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const addToCartAction = (data) => {
  return (dispatch) => {
    Axios.get(`${api_url}/cart?userID=${data.userID}&name=${data.name}`)
      .then((res) => {
        if (res.data.length === 0) {
          Axios.post(`${api_url}/cart`, data)
            .then((res) => {
              dispatch(getCartActionById(data.userID));
            })
            .catch((err) => {});
        } else {
          Axios.patch(`${api_url}/cart/${res.data[0].id}`, {
            qty: res.data[0].qty + data.qty,
          });
        }
        dispatch(getCartActionById(data.userID));
      })
      .catch((err) => {});
  };
};

export const deleteCartAction = (id, userID) => {
  return (dispatch) => {
    Axios.delete(`${api_url}/cart/${id}`)
      .then((res) => {
        dispatch(getCartActionById(userID));
      })
      .catch((err) => {});
  };
};

export const increaseQty = (name, qty, id, userID) => {
  return (dispatch) => {
    Axios.get(`${api_url}/products?name=${name}`)
      .then((res) => {
        if (qty < res.data[0].stock) {
          Axios.patch(`${api_url}/cart/${id}`, {
            qty: qty + 1,
          })
            .then((res) => {
              dispatch(getCartActionById(userID));
            })
            .catch((err) => {});
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Insufficient Stock.",
          });
        }
      })
      .catch((err) => {});
  };
};

export const decreaseQty = (name, qty, id, userID) => {
  return (dispatch) => {
    Axios.get(`${api_url}/products?name=${name}`)
      .then((res) => {
        if (qty !== 1) {
          Axios.patch(`${api_url}/cart/${id}`, {
            qty: qty - 1,
          })
            .then((res) => {
              dispatch(getCartActionById(userID));
            })
            .catch((err) => {});
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              "Min qty 1, If you want to delete, click the delete button on the right.",
          });
        }
      })
      .catch((err) => {});
  };
};

export const checkoutAction = (data, idProductArr) => {
  return (dispatch) => {
    Axios.post(`${api_url}/transaction`, data)
      .then((res) => {
        idProductArr.forEach((val, i) => {
          Axios.patch(`${api_url}/products/${val.id}`, {
            stock: val.stock - data.items[i].qty,
          })
            .then((res) => {
              console.log("berhasil patch stock");
            })
            .catch((err) => {});
        });
        data.items.forEach((val) => {
          Axios.delete(`${api_url}/cart/${val.id}`)
            .then((res) => {
              console.log("cart deleted");
              dispatch({
                type: "CHECKOUT",
              });
              dispatch(getCartActionById(data.userID));
            })
            .catch((err) => {});
        });
      })
      .catch((err) => {});
  };
};
