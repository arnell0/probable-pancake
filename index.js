const { tickers, createLimitOrder } = require('./functions');

createLimitOrder({ticker: tickers.BTCUSDT, type: "limit", side: "sell", amount: 1 });

