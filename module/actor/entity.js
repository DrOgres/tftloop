export default class tftloopActor extends Actor {
    prepareData() {
        super.prepareData();
        
        const actorData = this.data;

        // set the updated value here for use on the check boxes on the kid character sheet
        if (actorData.type == 'kid') {
            actorData.data.luck.max = 15 - Number(actorData.data.age);
            actorData.data.curLuck = actorData.data.luck.max - actorData.data.luck.value;
        }
        
        this.data.exp = actorData.data.exp    
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
