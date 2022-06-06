import React from "react";
import { Link } from "react-router-dom";
import "./PopUp.css";
function PopUp() {
  return (
    <>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <h3 style={{ color: "white" }}>Seat Reserved Successfully!</h3>
        <h4 style={{ color: "white" }}>Pay: Amount </h4>
        <br></br>
        {/* <p style={{ color: "white" }}>Pay using Solana Pay</p> */}
        <Link to={`/checkout?itemid=9934&sol-price=0.1&qty=2`}>
          Pay using Solona Pay
        </Link>
      </div>
    </>
  );
}

export default PopUp;
