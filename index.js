const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3000
app.use(bodyParser.json())

app.post("/hook", (req, res) => {
    const order = req.body
    console.log(order)
    res.status(200).send("hej").end() 
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`))