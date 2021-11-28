import React from "react";

function BaseCurrencyWidget({
  currencies,
  handleBaseCurrency,
  baseCurrency,
  error,
}) {
  return (
    <div className="base-currency">
      <h4>Base Currency</h4>
      <select value={baseCurrency.value} onChange={handleBaseCurrency}>
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
      {error && <span style={{ color: "black" }}>*{error.baseCurrency}</span>}
    </div>
  );
}

export default BaseCurrencyWidget;
