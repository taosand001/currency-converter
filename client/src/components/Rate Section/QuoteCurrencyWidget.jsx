import React from "react";

function QuoteCurrencyWidget({
  currencies,
  handleQuoteCurrency,
  quoteCurrency,
  error,
}) {
  return (
    <div className="quote-currency">
      <h4>Quote Currency</h4>
      <select value={quoteCurrency.value} onChange={handleQuoteCurrency}>
        <option disabled value="">
          select currency
        </option>
        {currencies.map((currency) => {
          return (
            <option key={currency} value={currency}>
              {currency}
            </option>
          );
        })}
      </select>
      {error.quoteCurrency && (
        <span style={{ color: "black" }}>{`*${error.quoteCurrency}`}</span>
      )}
    </div>
  );
}

export default QuoteCurrencyWidget;
