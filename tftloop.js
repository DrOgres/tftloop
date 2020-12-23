import {tftloop} from "./module/config.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import tftloopActorSheet from "./module/actor/sheet.js";
import tftloopActor from "./module/actor/entity.js";


Hooks.once("init", function(){
    console.log("TFTLOOP | Initializing Tales From the Loop");
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
    
    //registerSystemSetting();


    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("tftloop", tftloopActorSheet, {makeDefault: true});

    preloadHandlebarsTemplates();

})