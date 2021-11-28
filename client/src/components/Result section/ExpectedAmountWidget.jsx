import React from "react";

function ExpectedAmountWidget({ quoteAmount, quoteCurrency }) {
  return (
    <div className="expected-amount">
      <h6>Exchange Amount</h6>
      <span className="result">
        {quoteCurrency.value} {quoteAmount}
      </span>
    </div>
  );
}

export default ExpectedAmountWidget;
