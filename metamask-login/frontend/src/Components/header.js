import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Web3 from "web3";
import Axios from "axios";
const Header = () => {
  const [signData, setSignDta] = useState();
  const [Accounr, setAccount] = useState();

  const ethereum = async (e) => {
    e.preventDefault();
    if (window.ethereum != "") {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      //  await window.ethereum.enable();
      const details = await window.web3.eth.getAccounts();
      await Authenticate(details[0]);
      // const signedData = await window.ethereum?.request({
      //   method: "personal_sign",
      //   params: [JSON.stringify("hyy please signn"), details[0]],
      // });
      // setSignDta(signedData);
      // console.log("account", signedData);
    }
  };

  const Authenticate = async (account) => {
    // let res = await fetch(
    //   `http://localhost:8000/user/nonce?address=${account}`
    // );
    // const reBody = await res?.json();

    Axios.get(`http://localhost:8000/user/nonce?address=${account}`)
      .then(function (response) {
        // handle success
        console.log(response);
        getSign(account, response.data.message, response.data.tempToken);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    const getSign = async (account, msg, token) => {
      const signedData = await window.ethereum?.request({
        method: "personal_sign",
        params: [msg, account],
      });
      setSignDta(signedData);
      console.log("account", signedData);
      await Axios.post(
        `http://localhost:8000/user/verify?signature=${signedData}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
        }
      )
        .then((response) => {
          console.log("response", response);
        })
        .catch((error) => {});
    };
  };
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-primary">
      <a class="navbar-brand" href="#">
        Navbar
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              Home <span class="sr-only">(current)</span>
            </a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <button
            class="btn btn-success my-2 my-sm-0"
            type="submit"
            onClick={ethereum}
          >
            Connect Wallet
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Header;
