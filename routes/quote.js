const express = require("express");
const needle = require("needle");
const route = express.Router();

// Least Recently Used (LRU) cache system
var LRU = require("lru-cache"),
  options = {
    max: 500,
    length: function (n, key) {
      return n.length;
    },
    dispose: function (key, n) {
      n = "";
    },
    maxAge: 1000 * 60 * 60,
  },
  myCache = new LRU(options);

// middleware to get the exchange rate from 3rd party service provider
// and caching it to the memory

async function getExchangeRate(req, res, next) {
  const URL = process.env.BASE_URI;
  const baseCurrency = req.query.baseCurrency;
  const quoteCurrency = req.query.quoteCurrency;
  const BASE_URL = `${URL}/${baseCurrency}/${quoteCurrency}`;
  let data;
  try {
    if (myCache.has(BASE_URL)) {
      console.log("getting i");
      data = JSON.parse(myCache.get(BASE_URL));
      return res.status(200).json(data);
    }
    return next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

//function to calculate the exchange rate
function calculateRate(amount, rate, quoteCurrency) {
  const finalAmount = amount / 100;
  const fixedRate = finalAmount.toLocaleString("en-US", {
    currency: quoteCurrency,
  });
  const exchangeRate = Number((fixedRate * rate).toFixed(3));
  return exchangeRate;
}

// quote route

route.get("/quote", getExchangeRate, async (req, res) => {
  const URL = process.env.BASE_URI;
  let baseCurrency = req.query.baseCurrency;
  let quoteCurrency = req.query.quoteCurrency;
  let baseAmount = req.query.baseAmount;
  const BASE_URL = `${URL}/${baseCurrency}/${quoteCurrency}`;
  try {
    if (!baseCurrency) {
      return res
        .status(400)
        .json({ message: "baseCurrency is required", code: 400 });
    } else if (!quoteCurrency) {
      return res
        .status(400)
        .json({ message: "quoteCurrency is required", code: 400 });
    } else if (!baseAmount) {
      return res
        .status(400)
        .json({ message: "baseAmount is required", code: 400 });
    }
    const response = await needle("get", BASE_URL);
    console.log("getting server");
    const { conversion_rate } = response.body;
    data = Number(conversion_rate.toFixed(3));
    const expectedAmount = calculateRate(baseAmount, data);
    myCache.set(
      BASE_URL,
      JSON.stringify({ exchangeRate: data, quoteAmount: expectedAmount })
    );
    return res
      .status(200)
      .json({ exchangeRate: data, quoteAmount: expectedAmount });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

module.exports = route;
