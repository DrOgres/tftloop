import {tftloop} from "./config.js";


export const registerSystemSettings = function(){

    game.settings.registerMenu("tftloop", "homebrewMenu", {
        name: "Change the Default Kid Types",
        label: "Kid Type Editor",
        hint: "Open a dialog to edit the current kid types that show up on the character sheet.",
        icon: "fas fa-users",
        type: homeBrewMenu,
        restricted: true,
        data: {
            template: "systems/tftloop/templates/ui/hmBrewSettings.hbs",
            object: tftloop.kidTypes,
            title: "Define Types of Kids"
        },
        config: true
      });


   
    game.settings.register("tftloop", "kidTypeExpansion", {
        name: "SETTINGS.homebrewKidTypes",
        scope: "client",
        config: false,
        type: String,
        default: [],
        onChange: value => console.log(value)

    });

    
    


}

class homeBrewMenu extends FormApplication{


    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            title: "Define Types of Kids",
            id: "kid-config", 
            template: "systems/tftloop/templates/ui/hmBrewSettings.hbs",
            width: 500,
            height: 700,
            closeOnSubmit: true
        })
    }

    getData(){

        const data = super.getData();
        data.config = CONFIG.tftloop;
        console.log(data);
        console.log(data.config);
        data.options.customTypes = tftloop.customTypes;

        return data;
    }
    

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-create").click(this._onItemCreate.bind(this));


    }
    
    async _updateObject(event, formData) {
        console.log("update Object");
         
    }
    close(options){
        super.close(options);
        
        
    } 
    
    
    _onItemCreate(event){
        event.preventDefault();
        console.log(game.settings.get("tftloop", "kidTypeExpansion"));
        console.log("create clicked");
        console.log(this);
        this.options.customTypes.push("New Kid Type");
        let element = event.currentTarget;
        console.log(this.options.customTypes);
        console.log(element);
        console.log(game.settings.get("tftloop", "kidTypeExpansion"));
        let count = this.options.customTypes.length;
        game.settings.set("tftloop", "kidTypeExpansion", this.options.customTypes)
        console.log(game.settings);
       
        
        
    }

    
}

