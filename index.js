const fs = require('fs');
const mineflayer = require("mineflayer")
const { pathfinder, Movements, goals: { GoalGetToBlock } } = require('mineflayer-pathfinder')
const minecraftHawkEye = require('minecrafthawkeye');

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

let mode = "no"


function bindEvents(){
    let bot = mineflayer.createBot({
        host: ip,
        username: email,
        auth: "microsoft"
    })

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(minecraftHawkEye)
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
            process.exit()
        }
    })

    bot.on("time", () => {
        if(mode == "afk"){
            
        }
        if(mode == "gold"){
            
        }
    })

    bot.on("whisper", (username, message) => {
        const defaultMove = new Movements(bot)
        if(message.startsWith(".onion")){
            let coords = message.split(" ")
            bot.pathfinder.setMovements(defaultMove)
            bot.pathfinder.setGoal(new GoalGetToBlock(coords[1], coords[2], coords[3], 1))
        }
        if(message.startsWith(".fuckoff")){
            bot.quit("Im cool")
        }
        if(message.startsWith(".mode")){
            splitMode = message.split(" ")
            if(splitMode.length > 2 || splitMode.length < 2 || !(["gold", "afk", "blaze"].includes(splitMode[1]))){
                bot.whisper(username, "UHOH! .mode <blaze|afk|gold>")
            } else{
                mode = splitMode[1]
                if(mode == "afk"){
                    bot.chat("Going AFK")
                }
                if(mode == "gold"){
                    
                    const filter = e => e.name !== "experience_orb" && e.name !== "minecart" && e.name !== "hopper_minecart";
                    const piglinFilter = e => e.name === "zombified_piglin" && e.vehicle === undefined
                    entity = bot.nearestEntity(piglinFilter);
                    bot.hawkEye.autoAttack(entity, "bow");
                    console.log("shooting " + entity.name)
                }
            }
        }
    })

    bot.on("entityHurt", (e) => {
        console.log(e.name)
        console.log(e.vehicle)
    })

    bot.on("experience", () => {
        console.log(bot.experience)
    })

    bot.on("end", (reason) => {
        setTimeout(() => {
            console.log("Bot left for reason: " + reason);
            bindEvents();
        }, 25000);
    })
}

bindEvents()
