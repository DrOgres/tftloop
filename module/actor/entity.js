export default class tftloopActor extends Actor{

    prepareData(){
        super.prepareData();
        const actorData = this.data;

        //console.log(actorData.data.luck.max);
        actorData.data.luck.max = 15-Number(actorData.data.age);
        actorData.curLuck = actorData.data.luck.max - actorData.data.luck.value;
        //console.log(actorData.curLuck);
        
    }

}