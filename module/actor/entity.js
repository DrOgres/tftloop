export default class tftloopActor extends Actor{

    prepareData(){
        super.prepareData();
        const actorData = this.data;

        //console.log(actorData.data.luck.max);
        
        // set the updated value here for use on the check boxes on the kid character sheet
        if(actorData.type == 'kid'){
        actorData.data.luck.max = 15-Number(actorData.data.age);
        actorData.curLuck = actorData.data.luck.max - actorData.data.luck.value;
        }
        //console.log(actorData.curLuck);
        
    }

      /** @override */
    static async create(data, options={}) {
        data.token = data.token || {};
        if ( data.type === "kid" || data.type === "teen" ) {
        mergeObject(data.token, {
            vision: true,
            dimSight: 30,
            brightSight: 0,
            actorLink: true,
            disposition: 1
        }, {overwrite: false});
        }
        return super.create(data, options);
    }

}