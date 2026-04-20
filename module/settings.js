import {tftloop} from "./config.js";


export const registerSystemSettings = function () {
    game.settings.register("tftloop", "francein80s", {
        name: "SETTINGS.francein80s",
        scope: "world",
        config: true,
        restricted: true,
        default: false,
        type: Boolean 
    });

    game.settings.register("tftloop", "polishedition", {
        name: "SETTINGS.polishedition",
        scope: "world",
        config: true,
        restricted: true,
        default: false,
        type: Boolean 
    });
}
