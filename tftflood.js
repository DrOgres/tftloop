import {tftloop} from "./module/config.js";
import * as Chat from "./module/chat.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import tftloopActorSheet from "./module/actor/sheet.js";
import tftloopActor from "./module/actor/entity.js";
import { registerSystemSettings } from "./module/settings.js";



Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));
Hooks.on("renderChatMessage", (app, html, data) =>{
    Chat.hideChatActionButtons(app, html, data);

});

Hooks.once("init", function(){
    console.log("TFTLOOP | Initializing Tales From the Loop");
    console.log('%c     ', 'font-size:200px; background:url(./img/tftl-logo.png) no-repeat;');
    console.log(tftloop.ASCII);

    game.tftloop ={
        applications:{
            tftloopActor,
            tftloopActorSheet
        },
        config: tftloop,
        entities: {
            tftloopActor
        }
    }

    CONFIG.tftloop = tftloop;
    CONFIG.Actor.entityClass = tftloopActor;
    
    // Register System Settings
    registerSystemSettings();


    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("tftloop", tftloopActorSheet, {makeDefault: true});

    preloadHandlebarsTemplates();

    Handlebars.registerHelper("times", function(n, content) {
        let result = "";
        //console.log(n);
        for(let i = 0; i<n; ++i){
            content.data.index = i+1;
            result = result+content.fn(i);
        }
        
        return result;
    });

})