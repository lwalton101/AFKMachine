const fs = require('fs');
const mineflayer = require("mineflayer")

if(!fs.existsSync("config.json")){
    let data = JSON.stringify({
        "email": "nope",
        "ip": "17.18.19.20"
    })
    fs.writeFileSync("config.json", data)
}

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
let email = config["email"]
let ip = config["ip"]

const bot = mineflayer.createBot({
    host: ip,
    username: email,
    auth: "microsoft"
})

bot.on("login", () => {
    console.log("Logged into Server!")
});

bot.on("health", ()=> {
    if(bot.health < 4){
        console.log("bot was low on health")
        bot.quit();
    }
})