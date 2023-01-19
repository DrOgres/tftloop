import {tftloop} from "./module/config.js";
import * as Chat from "./module/chat.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import tftloopActorSheet from "./module/actor/sheet.js";
import tftloopActor from "./module/actor/entity.js";
import { registerSystemSettings } from "./module/settings.js";
import tftloopItemSheet from "./module/item/sheet.js";
import tftloopItem from "./module/item/entity.js";
import { tftloopRoll } from "./module/macros.js";

//dice so nice hooks for us to use the custom dice
Hooks.on('diceSoNiceReady', (dice3d) => {
	console.log("TFTLOOP STARTER - Dice init");
	dice3d.addSystem({id: "tftloop", name : "Tales from the Loop"}, "force");
	
	dice3d.addColorset({
		name: 'loop-orange',
		description : "Tales from the Loop Dice",
		category : "Tales From the Loop",
		foreground : '#fe7100',
		background : '#fe7100',
		outline : '#fe7100',
		edge : '#fe7100',
		texture : '#fe7100',
		material : 'plastic'
	});
	
	dice3d.addDicePreset({
		type: "d6",
		labels: [
			"systems/tftloop/img/dice/face1.png",
			"systems/tftloop/img/dice/face2.png",
			"systems/tftloop/img/dice/face3.png",
			"systems/tftloop/img/dice/face4.png",
			"systems/tftloop/img/dice/face5.png",
			"systems/tftloop/img/dice/face6.png"
		],
		colorset: "loop-orange",
		system: "tftloop"
	});
});

Hooks.on("preCreateItem", (createData) => {
    if (!createData.img) {
        createData.img = "systems/tftloop/img/riks_logo.jpg"
    }
});
Hooks.on("renderChatLog", (_app, html, _data) => Chat.addChatListeners(html));
Hooks.on("renderChatMessage", (app, html, data) => Chat.hideChatActionButtons(app, html, data));

// Hooks.once("ready", function() {
//     console.log("TFTLOOP | Ready", data);
//         Hooks.on("hotbarDrop", (bar, data, slot) => tftloopRoll(data, slot));
// });


Hooks.once("init", function() {
    console.log("TFTLOOP | Initializing Tales From the Loop");

    game.tftloop = {
        applications: {
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
    CONFIG.Actor.documentClass = tftloopActor; 
    CONFIG.Item.documentClass = tftloopItem;  
    
    // Register System Settings
    registerSystemSettings();

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("tftloop", tftloopActorSheet, { makeDefault: true });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("tftloop", tftloopItemSheet, { smakeDefault: true });

    preloadHandlebarsTemplates();

    Handlebars.registerHelper("times", function(n, content) {
        let result = "";
        for (let i = 0; i < n; ++i){
            content.data.index = i + 1;
            result = result + content.fn(i);
        }
        
        return result;
    });
})
