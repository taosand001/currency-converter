import React from "react";

function ConversionRateWidget({ exchangeRate }) {
  return (
    <div className="currency-rate">
      <h6>Exchange rate</h6>
      <span className="result">{exchangeRate}</span>
    </div>
  );
}

export default ConversionRateWidget;
