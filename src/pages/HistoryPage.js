import Axios from "axios";
import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import { api_url } from "../helpers/api_url";
import { connect } from "react-redux";

class HistoryPage extends Component {
  state = {
    history: [],
  };

  componentDidMount() {
    this.fetchHistory();
  }

  componentDidUpdate(prevProps, prevState) {
    const { userID } = this.props;
    if (prevProps.userID !== userID) {
      this.fetchHistory();
    }
  }

  fetchHistory = () => {
    const { userID } = this.props;
    console.log(userID);
    Axios.get(`${api_url}/transaction?userID=${userID}`)
      .then((res) => {
        this.setState({
          history: res.data,
        });
      })
      .catch((err) => {});
  };

  cancelOrder = (id, items) => {
    items.forEach((val) => {
      Axios.get(`${api_url}/products?name=${val.name}`)
        .then((res) => {
          Axios.patch(`${api_url}/products/${res.data[0].id}`, {
            stock: res.data[0].stock + val.qty,
          });
        })
        .catch((err) => {});
    });
    Axios.delete(`${api_url}/transaction/${id}`)
      .then((res) => {
        console.log("history delete");
        this.fetchHistory();
      })
      .catch((err) => {});
  };

  renderHistory = () => {
    const { history } = this.state;

    return history.map((val, index) => {
      let res = val.items.map((val) => {
        return (
          <div className="d-flex justify-content-between" key={val.name}>
            <div>
              {val.qty} {val.name}
            </div>
          </div>
        );
      });
      return (
        <tr key={index}>
          <td>{[index + 1]}</td>
          <td>{val.date}</td>
          <td>{res}</td>
          <td>Rp. {val.total.toLocaleString()}</td>
          <td>Belum Bayar</td>
          <td>
            <Button
              color="danger"
              onClick={() => this.cancelOrder(val.id, val.items)}
            >
              Cancel
            </Button>
          </td>
          <td></td>
        </tr>
      );
    });
  };

  render() {
    const { history } = this.state;
    if (history.length === 0) {
      return (
        <div className="d-flex justify-content-center my-5">
          <h1>You doesn't have transaction history.</h1>
        </div>
      );
    } else {
      return (
        <div>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Product</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderHistory()}</tbody>
          </Table>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.id,
  };
};

export default connect(mapStateToProps)(HistoryPage);
