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
