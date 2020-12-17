import Axios from "axios";
import { api_url } from "../../helpers/api_url";

export const fetchProductsAction = () => {
  return (dispatch) => {
    Axios.get(`${api_url}/products`)
      .then((res) => {
        dispatch({
          type: "FETCH_PRODUCTS",
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};
