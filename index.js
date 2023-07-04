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

let bot = mineflayer.createBot({
    host: ip,
    username: email,
    auth: "microsoft"
})

function bindEvents(){
    bot.on("login", () => {
        console.log("Logged into Server!")
    });
    
    bot.on("playerJoined", (player)=>{
        if(Math.floor(Math.random() * 101) > 100){
            bot.chat("You aren't welcome here, " + player.displayName)
        }
    });
    
    bot.on("chat", (username, message) => {
        if(message.includes("ryan")){
            bot.chat("tang")
        }
    })
    
    bot.on("health", ()=> {
        if(bot.health < 4){
            console.log("bot was low on health")
            bot.quit();
        }
    })
}

bindEvents()

bot.on("end", () => {
    setTimeout(() => {
        bot = mineflayer.createBot({
            host: ip,
            username: email,
            auth: "microsoft"
        })
    }, 25000)

    bindEvents();
})