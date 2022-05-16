const { tickers, createLimitOrderTimeout, fetchPositions } = require('./functions');



async function fetchPercentage(ticker) {
    const positions = await fetchPositions(tickers.BTCUSDT);
    if (positions.length < 1) return false
    let {side, percentage} = positions[0];

    side = side === "long" ? "sell" : "buy";

    percentage = percentage * 100;
    return percentage
}




let percentages = []

// function calculateAverage on the last 10 values of the array and return the average
function calculateAverage(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}



// funciton that runs every 5 seconds and fetches percentage and calculates average and if average is less than 0 it creates a limit order
setInterval(async () => {
    const percentage = await fetchPercentage(tickers.BTCUSDT);
    
    if(percentage) {
        percentages.push(percentage);
        const average = calculateAverage(percentages);
        console.log("average percentage: " + average);

        if (average < -15) {
            console.log("percentage is less than -20");
            createLimitOrderTimeout({ticker: tickers.BTCUSDT, type: "limit", side: "buy", amount: 1 });
        }
    } else {
        console.log("no positions");
        percentages = []
    }
}
, 5000);









/* 
[
  {
    info: {
      id: '627924bce1544f00017cae7a',
      symbol: 'XBTUSDTM',
      autoDeposit: true,
      maintMarginReq: 0.005,
      riskLimit: 500000,
      realLeverage: 31.22,
      crossMode: false,
      delevPercentage: 0.83,
      openingTimestamp: 1652193875011,
      currentTimestamp: 1652194033470,
      currentQty: 1,
      currentCost: 31.272,
      currentComm: 0.0062544,
      unrealisedCost: 31.272,
      realisedGrossCost: 0,
      realisedCost: 0.0062544,
      isOpen: true,
      markPrice: 31231.12,
      markValue: 31.23112,
      posCost: 31.272,
      posCross: 0,
      posInit: 1.0424,
      posComm: 0.01938864,
      posLoss: 0,
      posMargin: 1.06178864,
      posMaint: 0.17887584,
      maintMargin: 1.02090864,
      realisedGrossPnl: 0,
      realisedPnl: -0.0062544,
      unrealisedPnl: -0.04088,
      unrealisedPnlPcnt: -0.0013,
      unrealisedRoePcnt: -0.0392, * 100 = procentage
      avgEntryPrice: 31272,
      liquidationPrice: 30390,
      bankruptPrice: 30229,
      settleCurrency: 'USDT',
      isInverse: false,
      maintainMargin: 0.005
    },
    symbol: 'BTC/USDT:USDT',
    timestamp: 1652194033470,
    datetime: '2022-05-10T14:47:13.470Z',
    initialMargin: 1.0424,
    initialMarginPercentage: 0.03333333333333333,
    maintenanceMargin: 0.17887584,
    maintenanceMarginPercentage: 0.005,
    entryPrice: 31272,
    notional: 31.272,
    leverage: 31.22,
    unrealizedPnl: -0.04088,
    contracts: 1,
    contractSize: 0.001,
    marginRatio: undefined,
    liquidationPrice: 30390,
    markPrice: 31231.12,
    collateral: 1.02090864,
    marginType: 'isolated',
    side: 'long',
    percentage: -0.03921719109746738
  }
]
*/