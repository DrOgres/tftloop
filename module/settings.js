import {tftloop} from "./config.js";


export const registerSystemSettings = function () {
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

    game.settings.register("tftloop", "francein80s", {
        name: "SETTINGS.francein80s",
        scope: "world",
        config: true,
        restricted: true,
        default: false,
        type: Boolean 
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


class homeBrewMenu extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Define Types of Kids",
            id: "kid-config", 
            template: "systems/tftloop/templates/ui/hmBrewSettings.hbs",
            width: 500,
            height: 700,
            closeOnSubmit: true
        })
    }


    // load the data from the types.json file
    static async loadDataset() {
		const dataset = game.settings.get("forbidden-lands", "datasetDir") || null;
		if (dataset && dataset.substr(-4, 4) !== "json")
			throw ForbiddenLandsCharacterGenerator.handleBadDataset("Dataset is not a JSON file.");
		const lang = game.i18n.lang;
		const datasetName = CONFIG.fbl.dataSetConfig[lang] || "dataset";
		const defaultDataset = `systems/forbidden-lands/assets/datasets/chargen/${datasetName}.json`;
		const resp = await fetch(dataset ? dataset : defaultDataset).catch((_err) => {
			return {};
		});
		return resp.json();
	}

    getData() {
        data.config = CONFIG.tftloop;
        data.options.customTypes = tftloop.customTypes;

        return data;
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-create").click(this._onItemCreate.bind(this));
    }
    
    async _updateObject(_event, _formData) {
        console.log("update Object");
    }

    close(options) {
        super.close(options);
    } 
    
    _onItemCreate(event){
        event.preventDefault();
        
        this.options.customTypes.push("New Kid Type");
        game.settings.set("tftloop", "kidTypeExpansion", this.options.customTypes)
    }
}
