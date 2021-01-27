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
        //console.log(data.bonusItems);
        data.data.luck.max = 15-Number(data.data.age);
        data.curLuck = data.data.luck.max - data.data.luck.value;

        if(game.settings.get("tftloop", "francein80s")){
            data.francein80s = true;
        } else {
            data.francein80s = false;
        }
        console.log(data);
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
    
    async _onAddToPool(event){
        event.preventDefault();
       // console.log("add to pool");
        let actor = this.actor;
        console.log(actor._id);
        let data = actor.data.data;
        let items = this.actor.data.items.filter(function(item) {return item.type == "item"});;
        //console.log(this);
        let element = event.currentTarget;
        let rolled = element.dataset.rolled;
        let statRolled = '';
        let conditionPenalty = '';
        
        // if we are broken then we fail no matter what.
        if(!data.broken){
            //see what we rolled on and set up initial dice pool
        switch(rolled){
            case "body":
                console.log(data.body);
                data.dicePool += data.body;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.body")+' +'+data.body+'</div>';
                break;
            case "tech":
                data.dicePool += data.tech;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.tech")+' +'+data.tech+'</div>';
                break;
            case "heart":
                data.dicePool += data.heart;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.heart")+' +'+data.heart+'</div>';
                break;
            case "mind":
                data.dicePool += data.mind;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.mind")+' +'+data.mind+'</div>';
                break;
            case "sneak":
                data.dicePool += data.body;
                data.dicePool += data.sneak;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.body")+' +'+data.body+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.sneak")+' +'+data.sneak+'</div>';
                break;
            case "force":
                data.dicePool += data.body;
                data.dicePool += data.force;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.body")+' +'+data.body+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.force")+' +'+data.force+'</div>';
                break;
            case "move":
                data.dicePool += data.body;
                data.dicePool += data.move;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.body")+' +'+data.body+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.move")+' +'+data.move+'</div>';
                break;
            case "tinker":
                data.dicePool += data.tech;
                data.dicePool += data.tinker;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.tech")+' +'+data.tech+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.tinker")+' +'+data.tinker+'</div>';
                break;
            case "program":
                data.dicePool += data.tech;
                data.dicePool += data.program;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.tech")+' +'+data.tech+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.program")+' +'+data.program+'</div>';
                break;
            case "calculate":
                data.dicePool += data.tech;
                data.dicePool += data.calculate;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.tech")+' +'+data.tech+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.calculate")+' +'+data.calculate+'</div>';
                break;
            case "contact":
                data.dicePool += data.heart;
                data.dicePool += data.contact;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.heart")+' +'+data.heart+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.contact")+' +'+data.contact+'</div>';
                break;
            case "charm":
                data.dicePool += data.heart;
                data.dicePool += data.charm;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.heart")+' +'+data.heart+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.charm")+' +'+data.charm+'</div>';
                break;
            case "lead":
                data.dicePool += data.heart;
                data.dicePool += data.lead;
                
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.heart")+' +'+data.heart+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.lead")+' +'+data.lead+'</div>';
                break;
            case "investigate":
                data.dicePool += data.mind;
                data.dicePool += data.investigate;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.mind")+' +'+data.mind+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.investigate")+' +'+data.investigate+'</div>';
                break;
            case "comprehend": 
                data.dicePool += data.mind;
                data.dicePool += data.comprehend;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.mind")+' +'+data.mind+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.comprehend")+' +'+data.comprehend+'</div>';
                break;
            case "empathize":
                data.dicePool += data.mind;
                data.dicePool += data.empathize;
                statRolled =  '<div class="pool-detail">'+game.i18n.localize("tftloop.mind")+' +'+data.mind+'</div>';
                statRolled += '<div class="pool-detail">'+game.i18n.localize("tftloop.empathize")+' +'+data.empathize+'</div>';
                break;

        }
        //reduce dice by conditions
        if(data.upset){
            if(data.dicePool>0){
            data.dicePool -= 1;
            }
            conditionPenalty += '<div class="pool-detail penalty">'+game.i18n.localize("tftloop.upset")+' -1</div>';
        } 
        if(data.scared){
            if(data.dicePool>0){
            data.dicePool -= 1;
            }
            conditionPenalty += '<div class="pool-detail penalty">'+game.i18n.localize("tftloop.scared")+' -1</div>';
        }
        if(data.exhausted){
            if(data.dicePool>0){
            data.dicePool -= 1;
            }
            conditionPenalty += '<div class="pool-detail penalty">'+game.i18n.localize("tftloop.exhausted")+' -1</div>';
        }
        if(data.injured){
            if(data.dicePool>0){
            data.dicePool -= 1;
            }
            conditionPenalty += '<div class="pool-detail penalty">'+game.i18n.localize("tftloop.injured")+' -1</div>';
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
            <h2>`+game.i18n.localize("tftloop.rolling")+`: `+game.i18n.localize("tftloop."+rolled)+`</h2>
            <div class="pool-count">`+game.i18n.localize("tftloop.currentPool")+`: `+data.dicePool+` Dice</div>
            <div class="pool-details">
            `+statRolled+`
            
            `+conditionPenalty+`
            <div class="divider"></div>
            <div class="pool-item-select">
            <label for="roll-item">`+game.i18n.localize("tftloop.useItem")+`:</label>
            <select id="roll-item" name="useItem" style="margin-bottom: 5px">
                <option value="0">`+game.i18n.localize("tftloop.none")+`</option>
                <option value="2">`+game.i18n.localize("tftloop.iconic")+`:`+data.iconicItem.desc+` + 2</option>
                `+list+` 
            </select>
            </div>
            <div class="bonus-dice flexrow" style="margin-bottom: 5px;"><label>`+game.i18n.localize("tftloop.bonusDice")+`: </label>
            <input name="bonusDice" type="text" value="" placeholder="0" data-dtype="Number"/></div>
            </div>
            <div class="bug"><img src="systems/tftloop/img/loop_bug_sm.png" width="48" height="48"/></div>
        </div>
       
        `;


        let chatHTML = ``;


        //create dialog to get the use of item and or a bonus for dice
        let yesRoll = false;
        let d = new Dialog({
            title: game.i18n.localize("tftloop.diceRoll"),
            content: rollHTML,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("tftloop.roll"),
                    callback: () => {   yesRoll = true;
                                        
                                    }
                   },
                   two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("tftloop.cancel"),
                    callback: () => {
                                        //console.log("Chose too cancel that roll");
                                        data.dicePool = 0;
                                        //console.log("dice pool " + data.dicePool);
                                    }
                   }
            },
            default: "two",
            render: html => console.log("TFTLOOP  |  Rendering Dice Rolling Dialog"),
            close: async html => {
                if(yesRoll){
                    let itemBonus = Number(html.find('[name="useItem"]')[0].value);
                    let bonusDice = Number(html.find('[name="bonusDice"]')[0].value);
                    data.dicePool += itemBonus;
                    data.dicePool += bonusDice;
                    if(data.dicePool <= 0){
                        data.dicePool = 1;
                    }
                    let rollFormula = data.dicePool+"d6cs6";
                    //console.log("Chose Roll with or without options now roll " + rollFormula + "!");
                    
                    //console.log("dice pool " + data.dicePool);
                    let r = new Roll(rollFormula, this.actor.data.data);
                    r.evaluate();
                    let rollValue = r.total;
                    let rollTooltip = await Promise.resolve(r.getTooltip());
                    //console.log(rollValue);
                    //r.toMessage("this is our roll from our dice pool");
                    let sucessText = game.i18n.localize("tftloop.failure");
                    if( rollValue>0 ){
                        if(rollValue>1){
                            sucessText = rollValue+" "+game.i18n.localize("tftloop.successes");
                        } else {
                            sucessText = rollValue+" "+game.i18n.localize("tftloop.success");
                        }
                    }

                    let reRollDiceFormula = Number(data.dicePool-r.total);
                    //console.log(reRollDiceFormula);
                    //TODO pull this out to a template.
                    chatHTML = `
                    <span class="flavor-text">
                        <div class="chat-header flexrow">
                            <img class="portrait" width="48" height="48" src="`+this.actor.data.img+`"/>
                            <h1>`+game.i18n.localize("tftloop.tested")+`: `+game.i18n.localize("tftloop."+rolled)+`</h1>
                        </div>
                        <div class="tftloop chat-card" data-actor-id="`+actor._id+`">
                        <div class="dice-roll">
                            <div class="dice-result">
                                <div class="dice-formula">
                                `+r._formula+`
                                </div>
                                `+rollTooltip+`
                                <h4 class="dice-total">`+sucessText+`</h4>
                            </div>
                        </div>
                        <div class="reroll-info" data-owner-id="`+actor._id+`">
                            <button class="reroll" data-owner-id="`+actor._id+`" data-tested="`+game.i18n.localize("tftloop."+rolled)+`" data-dicepool="`+reRollDiceFormula+`" type="button">
                            `+game.i18n.localize("tftloop.reroll")+`
                            </button>
                        </div>
                        </div>
                        <div class="bug"><img src="systems/tftloop/img/loop_bug_sm.png" width="48" height="48"/></div>
                    </span>
                    `
                    data.dicePool = 0;
                    if(game.dice3d){
                        console.log("dice so nice here");
                        let check = game.dice3d.showForRoll(r, game.user, true, null, false);
                    }
                    //console.log(chatHTML);
                    let chatOptions ={
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({actor: this.actor, token: this.actor.img}),
                        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
                        roll: r,
                        rollMode: game.settings.get("core", "rollMode"),
                        content: chatHTML
                    }
                    ChatMessage.create(chatOptions);
                } else {
                console.log("dialog was closed!");
                data.dicePool = 0;
                }
            }
        });
        d.render(true);
        //roll that pool from the dialog
        //create the chat message and send to chat
        //reset the dicepool in the callback only
        
        //console.log("dice pool " + data.dicePool);

        } else {
            ui.notifications.info(game.i18n.localize("tftloop.brokeFail"));
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
        //console.log(actor);
        if(usedLuck<maxLuck){
            usedLuck+=1;
        } else {
            usedLuck=usedLuck;
        }

        actor.update({"data.luck.value": usedLuck});
        //console.log(actor.data.data.luck.max);
        //console.log(actor.data.data.luck.value);
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
                //console.log("pride");
                if(this.actor.data.data.prideCheck){
                    //console.log(this.actor.data.data.prideCheck);
                    this.actor.data.data.prideCheck = false;
                    actor.update({ "data.prideCheck" : false});
                    ;
                } else {
                    //console.log(this.actor.data.data.prideCheck);
                    this.actor.data.data.prideCheck = true;
                    actor.update({ "data.prideCheck" : true});
                    
                }
                break;


        }

    }

}