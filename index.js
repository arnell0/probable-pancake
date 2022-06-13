const { tickers, createLimitOrder } = require('./functions');

const fs = require('fs');
const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3002

app.use(bodyParser.json())
app.listen(PORT, () => console.log(`Internal trading api running on port ${PORT}`))


app.post("/api/probable-pancake", (req, res) => {
    const _req = {
        timestamp: new Date().toISOString(),
        body: req.body,
    }

    console.log("=====================================================")
    console.log("Incoming request:")
    console.log( req.body )
    console.log("\n\n\n")

    res.status(200).end() // Responding is important
    fs.appendFileSync("/root/projects/probable-pancake/logs/probable-pancake.json", JSON.stringify(_req, null, 2) + "\n\n\n")
    //parseRequest(req.body)
})

function parseRequest(body) {
    const { action, direction } = body;

    if (action === "OPEN" && direction === "LONG") {
        createLimitOrder({ticker: tickers.BTCUSDT, type: "limit", side: "buy", amount: 1 }); 
    } else if (action === "OPEN" && direction === "SHORT") {
        createLimitOrder({ticker: tickers.BTCUSDT, type: "limit", side: "sell", amount: 1 }); 
    } else if (action === "CLOSE" && direction === "LONG") {
        createLimitOrder({ticker: tickers.BTCUSDT, type: "limit", side: "sell", amount: 1 }); 
    } else if (action === "CLOSE" && direction === "SHORT") {
        createLimitOrder({ticker: tickers.BTCUSDT, type: "limit", side: "buy", amount: 1 }); 
    } 
}

