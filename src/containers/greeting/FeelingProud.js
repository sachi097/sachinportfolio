import React, { Component } from "react";
import myGif from "../../assests/images/20200630_162659.gif";

class FeelingProud extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <img style={{height:600, width:1000}} src={myGif} alt="my-gif" />
    );
  }
}

export default FeelingProud;
