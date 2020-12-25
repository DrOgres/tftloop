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

        data.relationships = data.items.filter(function(item) {return item.type == "relationship"});
        data.bonusItems = data.items.filter(function(item) {return item.type == "item"});

        data.data.luck.max = 15-Number(data.data.age);
        data.curLuck = data.data.luck.max - data.data.luck.value;
        
        return data;
    }

  

    activateListeners(html){
        if (this.isEditable){
        html.find(".reset-luck").click(this._resetLuck.bind(this));
        html.find(".use-luck").click(this._onUseLuck.bind(this));
        html.find(".toggle-boolean").click(this._onToggleClick.bind(this));
        html.find(".item-create").click(this._onItemCreate.bind(this));
        html.find(".inline-edit").change(this._onItemEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".exp-boxes").on("click contextmenu", this._onExpChange.bind(this));
        }

        if(this.actor.owner){

        }

        super.activateListeners(html);
    }
    
    _onExpChange(event){
        event.preventDefault();

        let currentCount = this.actor.data.data.exp;
        let newCount;

        if(event.type == "click"){
            newCount = Math.min(currentCount + 1, 10);
        } else {
            //right click
            newCount = Math.max(currentCount - 1, 0);
        }

        this.actor.update({"data.exp" : newCount});
    }

    _resetLuck(event){
        event.preventDefault();
        let actor = this.actor;
        actor.update({"data.luck.value": 0});
    }

    _onUseLuck(event){
        event.preventDefault();
        let element = event.currentTarget;

        let actor = this.actor;
        let maxLuck = actor.data.data.luck.max;
        let usedLuck = actor.data.data.luck.value;
        console.log(actor);
        if(usedLuck<maxLuck){
            usedLuck+=1;
        } else {
            usedLuck=usedLuck;
        }

        actor.update({"data.luck.value": usedLuck});
        console.log(actor.data.data.luck.max);
        console.log(actor.data.data.luck.value);
    }

    _onItemEdit(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".info-item").dataset.itemId;
        let item = this.actor.getOwnedItem(itemId);
        let field = element.dataset.field;

        return item.update({[field]: element.value});

    }


    _onItemDelete(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".info-item").dataset.itemId;
       
        return this.actor.deleteOwnedItem(itemId);


    }

    _onItemCreate(event){
        event.preventDefault();
        let element = event.currentTarget;
        let actor = this.actor;
        let type = element.dataset.type
        let itemData = {
                name: game.i18n.localize("tftloop.new"),
                type: element.dataset.type
                };
        
       
        
        return actor.createOwnedItem(itemData);
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
            case "prideCheck":
                if(this.actor.data.data.prideCheck){
                    
                    this.actor.data.data.prideCheck = false;
                    actor.update({ "data.prideCheck" : false});
                    ;
                } else {
                   
                    this.actor.data.data.prideCheck = true;
                    actor.update({ "data.prideCheck" : true});
                    
                }
                break;


        }

    }

}