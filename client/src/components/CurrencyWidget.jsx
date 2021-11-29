import React, { useState } from "react";
import BaseCurrencyWidget from "./Rate Section/BaseCurrencyWidget";
import BaseInputWidget from "./Rate Section/BaseInputWidget";
import ConversionRateWidget from "./Result section/ConversionRateWidget";
import ExpectedAmountWidget from "./Result section/ExpectedAmountWidget";
import QuoteCurrencyWidget from "./Rate Section/QuoteCurrencyWidget";
import Urls from "../utils/urls";

function CurrencyWidget(props) {
  const currencies = ["EUR", "USD", "GBP", "ILS"];
  const [baseCurrency, setBaseCurrency] = useState({
    name: "baseCurrency",
    value: "",
  });
  const [quoteCurrency, setQuoteCurrency] = useState({
    name: "quoteCurrency",
    value: "",
  });
  const [conversionRate, setConversionRate] = useState();
  const [expectedAmount, setExpectedAmount] = useState();
  const [baseAmount, setBaseAmount] = useState("");
  const [isResult, setIsResult] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, isLoading] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState("");

  const handleBaseCurrency = (e) => {
    setBaseCurrency({ value: e.target.value });
    checkCurrency(e.target.value, quoteCurrency);
  };

  const handleQuoteCurrency = (e) => {
    setQuoteCurrency({ value: e.target.value });
    checkCurrency(e.target.value, baseCurrency);
  };

  const handleAmountInput = async (e) => {
    const value = e.target.value;
    setBaseAmount(value);
  };

  // function to submit the data request to the route /quote
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = checkCurrency(baseCurrency, quoteCurrency);
    if (Object.keys(result).length > 0) {
      return;
    }

    try {
      isLoading(true);
      const parameters = {
        baseCurrency: baseCurrency.value,
        quoteCurrency: quoteCurrency.value,
        baseAmount: Number(baseAmount),
      };
      const response = await fetch(
        `${Urls.quoteUrl}?baseCurrency=${parameters.baseCurrency}&quoteCurrency=${parameters.quoteCurrency}&baseAmount=${parameters.baseAmount}`
      );
      const data = await response.json();
      setConversionRate(data.exchangeRate);
      setExpectedAmount(data.quoteAmount);
      setDisplayCurrency(quoteCurrency);
      setIsResult(true);
      isLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // function to check if baseCurrency, quoteCurrency and base amount are empty

  const checkCurrency = (...entries) => {
    let errors = {};
    entries.forEach((entry) => {
      if (entry.value === "") {
        errors[entry.name] = `${entry.name} cannot be empty`;
      } else {
        delete errors[entry.name];
      }
    });
    if (baseAmount.trim() === "") {
      errors["baseAmount"] = "base amount must not be empty";
    } else {
      delete errors["baseAmount"];
    }
    setErrors(errors);
    return errors;
  };

  return (
    <div className="currency-widget">
      <div className="rate-section">
        <BaseCurrencyWidget
          handleBaseCurrency={handleBaseCurrency}
          baseCurrency={baseCurrency}
          currencies={currencies}
          error={errors}
        />
        <QuoteCurrencyWidget
          handleQuoteCurrency={handleQuoteCurrency}
          quoteCurrency={quoteCurrency}
          currencies={currencies}
          error={errors}
        />
        <BaseInputWidget
          handleSubmit={handleSubmit}
          handleAmountInput={handleAmountInput}
          baseAmount={baseAmount}
          error={errors}
          loading={loading}
        />
      </div>
      {loading && !isResult && <div className="loading"></div>}
      {isResult && (
        <div className="result-section">
          <ConversionRateWidget exchangeRate={conversionRate} />
          <ExpectedAmountWidget
            quoteAmount={expectedAmount}
            quoteCurrency={displayCurrency}
          />
        </div>
      )}
    </div>
  );
}

export default CurrencyWidget;
