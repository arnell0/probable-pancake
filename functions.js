require('dotenv').config();
const {API_KEY, API_SECRET, API_PASSWORD} = process.env
const ccxt = require ('ccxt');
const k = require('/root/probable-pancake/node_modules/ccxt/js/kucoinfutures.js')

const exchange = new k({
    apiKey: API_KEY,
    secret: API_SECRET,
    password: API_PASSWORD,
    timeout: 30000,
    enableRateLimit: true,
    verbose: false
});

const tickers = {
    BTCUSDT: "BTC/USDT:USDT",
}

async function createLimitOrder(props) {
    const {ticker, type, side, amount} = props;
    
    let price = await exchange.fetchTicker(ticker);
    price = side === "buy" ? price.bid : price.ask;
    

    const order = await exchange.createOrder(ticker, type, side, amount, price);
    console.log("Order placed at price: " + price);
    
    setTimeout(async () => {
        openOrder = await exchange.fetchOrder(order.id);
        if (openOrder.status === "open") {
            await exchange.cancelOrder(order.id);
            console.log("order cancelled");
            createLimitOrder(props)
        } else if (openOrder.status === "closed") {
            console.log("order closed");
            logOrderJSON(openOrder);
            return openOrder
        }
    }
    , 10000);
}

async function createLimitOrderTimeout(props) {
    const {ticker, type, side, amount, timeout} = props;
    
    if(timeout >= 5) {
        const order = await exchange.createOrder(ticker, "market", side, amount);

        setTimeout(async () => {
            openOrder = await exchange.fetchOrder(order.id);
            console.log("order closed");
            logOrderJSON(openOrder);
            return openOrder
        }
        , 20000);

    } else {
        let price = await exchange.fetchTicker(ticker);
        price = side === "buy" ? price.bid : price.ask;
        
        const order = await exchange.createOrder(ticker, type, side, amount, price);
        console.log("Order placed at price: " + price);
    
        setTimeout(async () => {
            openOrder = await exchange.fetchOrder(order.id);
            if (openOrder.status === "open") {
                await exchange.cancelOrder(order.id);
                console.log("order cancelled");
                props.timeout = props.timeout + 1;
                createLimitOrderTimeout(props)
            } else if (openOrder.status === "closed") {
                console.log("order closed");
                logOrderJSON(openOrder);
                return openOrder
            }
        }
        , 10000);
    }
    
    }

// open test.json in logs folder and parse it then append order to it and format it to be readable then save it, then open it again and print it to console
function logOrderJSON(order) {
    const fs = require('fs');
    const path = require('path');
    const file = path.join(__dirname, 'logs', 'orders.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.push(order);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const fetchPositions = async (ticker) => {
    const positions = await exchange.fetchPositions(ticker);
    return positions
}



module.exports = {tickers, createLimitOrder, createLimitOrderTimeout, fetchPositions};
  
