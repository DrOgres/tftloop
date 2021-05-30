import {tftloop} from "./module/config.js";
import * as Chat from "./module/chat.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import tftloopActorSheet from "./module/actor/sheet.js";
import tftloopActor from "./module/actor/entity.js";
import { registerSystemSettings } from "./module/settings.js";
import tftloopItemSheet from "./module/item/sheet.js";
import tftloopItem from "./module/item/entity.js";


Hooks.on("preCreateItem", (createData) => {
    if (!createData.img)
    createData.img = "systems/tftloop/img/riks_logo.jpg"
});
Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));
Hooks.on("renderChatMessage", (app, html, data) =>{
    Chat.hideChatActionButtons(app, html, data);

});

Hooks.once("init", function(){
    console.log("TFTLOOP | Initializing Tales From the Loop");
    console.log(tftloop.ASCII);
    

    game.tftloop ={
        applications:{
            tftloopActor,
            tftloopActorSheet,
            tftloopItem,
            tftloopItemSheet
        },
        config: tftloop,
        entities: {
            tftloopActor,
            tftloopItem
        }
    }

    CONFIG.tftloop = tftloop;
    CONFIG.Actor.documentClass = tftloopActor; //deprecated in 0.8.0
    CONFIG.Item.documentClass = tftloopItem;  //deprecated in 0.8.0
    
    // Register System Settings
    registerSystemSettings();


    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("tftloop", tftloopActorSheet, {makeDefault: true});

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("tftloop", tftloopItemSheet, {makeDefault: true});

    preloadHandlebarsTemplates();

    Handlebars.registerHelper("times", function(n, content) {
        let result = "";
        //console.log("tftloop | times helper n times:  "+n);
        for(let i = 0; i<n; ++i){
            content.data.index = i+1;
            result = result+content.fn(i);
        }
        
        return result;
    });

})