export default class tftloopActor extends Actor {
    prepareData() {
        super.prepareData();
        
        const actorData = this.system;
        

        // set the updated value here for use on the check boxes on the kid character sheet
        if (actorData.type == 'kid') {
            actorData.luck.max = 15 - Number(actorData.age);
            // console.log("luck:" + (15 - Number(actorData.age)));
            actorData.curLuck = actorData.luck.max - actorData.luck.value;
        }
        
        this.exp = actorData.exp    
    }


    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        const link = data.type === "kid" || data.type === "teen";
        const displayName = link ? CONST.TOKEN_DISPLAY_MODES.HOVER : CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER;
        
        let actorDefaults = {
            "prototypeToken.displayName" : displayName,
            "prototypeToken.displayBars" : CONST.TOKEN_DISPLAY_MODES.NONE,
            "prototypeToken.disposition" : CONST.TOKEN_DISPOSITIONS.FRIENDLY,
            "prototypeToken.actorLink" : link,
            "prototypeToken.name" : `${data.name}`,
            "prototypeToken.sight.enabled" : true,
            "prototypeToken.sight.range" : 30,
        }

        this.updateSource(actorDefaults);
    }
    
    static async create(data, options = {}) {
        if (data.type === "kid" || data.type === "teen") {
            mergeObject(
              {
                    overwrite: false
            });
        }
        return super.create(data, options);
    }
}
