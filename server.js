import express, { response } from  "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + "/public"));

app.get("/" , (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/dictionary.csv", (req, res) => {
    res.sendFile(__dirname + "/dictionary.csv");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
});