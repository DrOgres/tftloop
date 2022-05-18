export default class tftloopActor extends Actor {
    prepareData() {
        super.prepareData();
        
        const actorData = this.system;
        console.log(this);
        console.log(actorData);

        // set the updated value here for use on the check boxes on the kid character sheet
        if (actorData.type == 'kid') {
            actorData.luck.max = 15 - Number(actorData.age);
            console.log("luck:" + (15 - Number(actorData.age)));
            actorData.curLuck = actorData.luck.max - actorData.luck.value;
        }
        
        this.exp = actorData.exp    
    }

    
    static async create(data, options = {}) {
        data.token = data.token || {};

        if (data.type === "kid" || data.type === "teen") {
            mergeObject(
                data.token, {
                    vision: true,
                    dimSight: 30,
                    brightSight: 0,
                    actorLink: true,
                    disposition: 1
                }, {
                    overwrite: false
            });
        }

        return super.create(data, options);
    }
}
