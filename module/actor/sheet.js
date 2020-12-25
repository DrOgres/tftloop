export default class tftloopActorSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/tftloop/templates/actors/character.hbs",
            classes: ["tftloop", "sheet", "actor", "character", "kid"],
            width: 800,
            height: 950
        });
    }

    get template() {
        const path = "systems/tftloop/templates/actors";
        return `${path}/${this.actor.data.type}.hbs`;
    }

    getData(){
        const data = super.getData();
        data.config = CONFIG.tftloop;

        return data;
    }

  

    activateListeners(html){
        html.find(".toggle-boolean").click(this._onToggleClick.bind(this));

        super.activateListeners(html);
    }

    _onToggleClick(event){
        event.preventDefault();
        let element = event.currentTarget;
        let actor = this.actor;
       

        switch (element.dataset.toggle){
            case "upset": 
                if(this.actor.data.data.upset){
                    
                    this.actor.data.data.upset = false;
                    actor.update({ "data.upset" : false});
                    ;
                } else {
                   
                    this.actor.data.data.upset = true;
                    actor.update({ "data.upset" : true});
                    
                }
                break;
            case "scared":
                if(this.actor.data.data.scared){
                    
                    this.actor.data.data.scared = false;
                    actor.update({ "data.scared" : false});
                    ;
                } else {
                   
                    this.actor.data.data.scared = true;
                    actor.update({ "data.scared" : true});
                    
                }
                break;
            case "exhausted":
                if(this.actor.data.data.exhausted){
                    
                    this.actor.data.data.exhausted = false;
                    actor.update({ "data.exhausted" : false});
                    ;
                } else {
                   
                    this.actor.data.data.exhausted = true;
                    actor.update({ "data.exhausted" : true});
                    
                }
                break;
            case "injured":
                if(this.actor.data.data.injured){
                    
                    this.actor.data.data.injured = false;
                    actor.update({ "data.injured" : false});
                    ;
                } else {
                   
                    this.actor.data.data.injured = true;
                    actor.update({ "data.injured" : true});
                    
                }
                break;
            case "broken":
                if(this.actor.data.data.broken){
                    
                    this.actor.data.data.broken = false;
                    actor.update({ "data.broken" : false});
                    ;
                } else {
                   
                    this.actor.data.data.broken = true;
                    actor.update({ "data.broken" : true});
                    
                }
                break;


        }

    }

}