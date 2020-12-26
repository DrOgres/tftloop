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
        console.log(data.bonusItems);
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
            html.find(".add-to-pool").click(this._onAddToPool.bind(this));

        }

        super.activateListeners(html);
    }
    
    _onAddToPool(event){
        event.preventDefault();
       // console.log("add to pool");
        let actor = this.actor;
        let data = actor.data.data;
        let items = this.actor.data.items.filter(function(item) {return item.type == "item"});;
        //console.log(this);
        let element = event.currentTarget;
        let rolled = element.dataset.rolled;
        
        // if we are broken then we fail no matter what.
        if(!data.broken){
            //see what we rolled on and set up initial dice pool
        switch(rolled){
            case "body":
                console.log(data.body);
                data.dicePool += data.body;
                break;
            case "tech":
                data.dicePool += data.tech;
                break;
            case "heart":
                data.dicePool += data.heart;
                break;
            case "mind":
                data.dicePool += data.heart;
                break;
            case "sneak":
                data.dicePool += data.body;
                data.dicePool += data.sneak;
                break;
            case "force":
                data.dicePool += data.body;
                data.dicePool += data.force;
                break;
            case "move":
                data.dicePool += data.body;
                data.dicePool += data.move;
                break;
            case "tinker":
                data.dicePool += data.tech;
                data.dicePool += data.tinker;
                break;
            case "program":
                data.dicePool += data.tech;
                data.dicePool += data.program;
                break;
            case "calculate":
                data.dicePool += data.tech;
                data.dicePool += data.calculate;
                break;
            case "contact":
                data.dicePool += data.heart;
                data.dicePool += data.contact;
                break;
            case "charm":
                data.dicePool += data.heart;
                data.dicePool += data.charm;
                break;
            case "lead":
                data.dicePool += data.heart;
                data.dicePool += data.lead;
                break;
            case "investigate":
                data.dicePool += data.mind;
                data.dicePool += data.investigate;
                break;
            case "comprehend": 
                data.dicePool += data.mind;
                data.dicePool += data.comprehend;
                break;
            case "empathize":
                data.dicePool += data.mind;
                data.dicePool += data.empathize;
                break;

        }
        //reduce dice by conditions
        if(data.upset){
            data.dicePool -= 1;
        } 
        if(data.scared){
            data.dicePool -= 1;
        }
        if(data.exhausted){
            data.dicePool -= 1;
        }
        if(data.injured){
            data.dicePool -= 1;
        }

       // console.log(items);
        let list = "";
        //console.log("html segment"+items);
            
        for(let n = 0; n<items.length; n++){
            list += '<option value="'+items[n].data.bonus+'">'+items[n].data.description+' + '+ items[n].data.bonus+'</option>'
            
        }
        
        //next set up the dialog to allow the player to select an item and add any bonus dice
        // build the html for the roll dialog
        let rollHTML = `<div class="form-group">
            <h2>Rolling: `+game.i18n.localize("tftloop."+rolled)+`</h2>
            <div class="pool-count">`+game.i18n.localize("tftloop.currentPool")+`: `+data.dicePool+` Dice</div>
            <label>Use Item:</label>
            <select id="roll-item" name="useItem" style="margin-bottom: 5px">
                <option value="0">None</option>
                <option value="2">Iconic Item:`+data.iconicItem.desc+` + 2</option>
                `+list+`
                
            </select>
            <div class="bonus-dice flexrow" style="margin-bottom: 5px;"><label>Bonus Dice</label>
            <input name="bonusDice" type="text" value="" placeholder="0" data-dtype="Number"/></div>
        </div>
       
        `;

        //create dialog to get the use of item and or a bonus for dice
        let yesRoll = false;
        let d = new Dialog({
            title: "roll dialog",
            content: rollHTML,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Roll!",
                    callback: () => {   yesRoll = true;
                                        
                                    }
                   },
                   two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel",
                    callback: () => {
                                        //console.log("Chose too cancel that roll");
                                        data.dicePool = 0;
                                        //console.log("dice pool " + data.dicePool);
                                    }
                   }
            },
            default: "two",
            render: html => console.log("query mods and items then roll or cancel"),
            close: html => {
                if(yesRoll){
                    let itemBonus = Number(html.find('[name="useItem"]')[0].value);
                    let bonusDice = Number(html.find('[name="bonusDice"]')[0].value);
                    data.dicePool += itemBonus;
                    data.dicePool += bonusDice;
                    let rollFormula = data.dicePool+"d6cs6";
                    //console.log("Chose Roll with or without options now roll " + rollFormula + "!");
                    data.dicePool = 0;
                    //console.log("dice pool " + data.dicePool);
                    let r = new Roll(rollFormula);
                    r.evaluate();
                    //r.toMessage("this is our roll from our dice pool");
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({actor: this.actor, token: this.actor.img}),
                        content: "this is the roll we made from our dice pool",
                        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                        isRoll: true,
                        roll: r,
                        sound: ""
                    });
                } else {
                console.log("dialog was closed!");
                }
            }
        });
        d.render(true);
        //roll that pool from the dialog
        //create the chat message and send to chat
        //reset the dicepool in the callback only
        
        //console.log("dice pool " + data.dicePool);

        } else {
            ui.notifications.info("You Automatically fail any roll when you are Broken!");
        }
        

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
        let itemId = element.closest(".item").dataset.itemId;
        
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