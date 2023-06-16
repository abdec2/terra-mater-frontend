import React, { useState } from "react";
import SwitchSelector from "react-switch-selector";

const Switch = (props) => {
  const { value, setValue } = props;
  const options = [
    {
      label: "Buy",
      value: "buy",
      selectedBackgroundColor: "white",
      selectedFontColor: "black",
    },
    {
      label: "Sell",
      value: "sell",
      selectedBackgroundColor: "white",
      selectedFontColor: "black",
    },
  ];
  const onChange = (newValue) => {
    console.log(newValue);
    setValue(newValue);
  };
  // const initialSelectedIndex = options.findIndex(
  //   ({ value }) => value === "bar"
  // );
  return (
    <div className="">
      <span className="dataview-header"></span>
      <div className="your-required-wrapper" style={{ width: 150, height: 40 }}>
        <SwitchSelector
          onChange={onChange}
          options={options}
          // initialSelectedIndex={0}
          backgroundColor={"#ff343f"}
          fontColor={"white"}
        />
      </div>
    </div>
  );
};

export default Switch;
