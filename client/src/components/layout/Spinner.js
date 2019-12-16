import React, { Fragment } from "react";
import spinner from "./spinner.gif";

export default () => (
  <Fragment>
    <img src={spinner} style={spinnerStyles} alt="Loading..." />
  </Fragment>
);

const spinnerStyles = {
  width: "200px",
  margin: "auto",
  display: "block"
};
