const INITIAL_STATE = {
  productList: [],
};

export const productReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS":
      return {
        ...state,
        productList: action.payload,
      };
    case "FETCH_BY_ID":
      return {
        ...state,
        productById: action.payload,
      };
    default:
      return state;
  }
};
