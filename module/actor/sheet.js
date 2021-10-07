export default class tftloopActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(
            super.defaultOptions,
            {
                template: "systems/tftloop/templates/actors/character.hbs",
                classes: ["tftloop", "sheet", "actor", "character", "kid"],
                width: 800,
                height: 950,
                tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}]

            }
        );
    }


    get template() {
        return `systems/tftloop/templates/actors/${this.actor.data.type}.hbs`;
    }


    getData() {
        const data = super.getData();
        data.config = CONFIG.tftloop;

        data.relationships = data.items.filter(function(item) {
            return item.type == "relationship"
        });

        data.bonusItems = data.items.filter(function(item) {
            return item.type == "item"
        });

        if (this.actor.data.type == 'teen') {
            data.scars = data.items.filter(function(item) {
                return item.type == "scar"
            });
        }
       
        // set the max luck to change the number of boxes we draw on the sheet
        if (this.actor.data.type == 'kid') {
            data.data.data.luck.max = 15 - Number(data.data.data.age);
            data.data.curLuck = data.data.data.luck.max - data.data.data.luck.value;
        }

        data.francein80s = game.settings.get("tftloop", "francein80s") ? true : false;
        
        return data;
    }


    activateListeners(html) {
        if (this.isEditable) {
            html.find(".reset-luck").click(this._resetLuck.bind(this));
            html.find(".use-luck").click(this._onUseLuck.bind(this));
            html.find(".toggle-boolean").click(this._onToggleClick.bind(this));
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".inline-edit").change(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            html.find(".exp-boxes").on("click contextmenu", this._onExpChange.bind(this));
            html.find(".item-open").click(this._onItemOpen.bind(this));
            html.find(".sheet-body").on("drop", this._onItemDrop.bind(this));
            html.find(".item").on("drag", this._onItemDrag.bind(this));
        }

        if (this.actor.isOwner) {
            html.find(".add-to-pool").click(this._onAddToPool.bind(this));
        }

        super.activateListeners(html);
    }


    _onItemDrag(event) {
        event.preventDefault();

        game.data.item = this.actor.getOwnedItem(
            event.currentTarget.closest(".item").dataset.itemId
        )
    }
    

    _onItemDrop(event) {
        event.preventDefault();

        let actor = this.actor;
        let storedItem = game.data.itemstore;

        if (storedItem.data.id && storedItem.actor != actor) {
            return actor.createOwnedItem(storedItem.data);
        }

        return;
    }


    async _onAddToPool(event) {
        event.preventDefault();

        let actor = this.actor;
        
        let data = actor.data.data;
        let items = this.actor.data.items.filter(function(item) {
            return item.type == "item"
        });;
        
        let element = event.currentTarget;
        let rolled = element.dataset.rolled;
        let statRolled = '';
        let conditionPenalty = '';
        
        // if we are broken then we fail no matter what.
        if (!data.broken) {
            //see what we rolled on and set up initial dice pool
            switch(rolled) {
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
            if (data.upset) {
                if (data.dicePool > 0) {
                    data.dicePool -= 1;
                }
                conditionPenalty += '<div class="pool-detail penalty">' + game.i18n.localize("tftloop.upset") + ' -1</div>';
            }

            if (data.scared) {
                if (data.dicePool > 0) {
                    data.dicePool -= 1;
                }
                conditionPenalty += '<div class="pool-detail penalty">' + game.i18n.localize("tftloop.scared") + ' -1</div>';
            }

            if (data.exhausted) {
                if (data.dicePool > 0) {
                    data.dicePool -= 1;
                }
                conditionPenalty += '<div class="pool-detail penalty">' + game.i18n.localize("tftloop.exhausted") + ' -1</div>';
            }

            if (data.injured) {
                if (data.dicePool > 0) {
                    data.dicePool -= 1;
                }
                conditionPenalty += '<div class="pool-detail penalty">' + game.i18n.localize("tftloop.injured") + ' -1</div>';
            }

            let list = "";
                
            for (let n = 0; n < items.length; n++){
                list += '<option value="' + items[n].data.data.bonus + '">' + items[n].name + ' + ' + items[n].data.data.bonus + '</option>'
            }
            
            // next set up the dialog to allow the player to select an item and add any bonus dice
            // build the html for the roll dialog
            let rollHTML = `
                <div class="form-group">
                    <h2>` + game.i18n.localize("tftloop.rolling") + `: ` + game.i18n.localize("tftloop." + rolled) + `</h2>
                    <div class="pool-count">` + game.i18n.localize("tftloop.currentPool") + `: ` + data.dicePool + ` Dice</div>
                    <div class="pool-details">
                        ` + statRolled + `
                    
                        ` + conditionPenalty + `
                    <div class="divider"></div>
                    <div class="pool-item-select">
                    <label for="roll-item">` + game.i18n.localize("tftloop.useItem") + `:</label>
                    <select id="roll-item" name="useItem" style="margin-bottom: 5px">
                        <option value="0">` + game.i18n.localize("tftloop.none") + `</option>
                        <option value="2">` + game.i18n.localize("tftloop.iconic") + `` + data.iconicItem.desc + ` + 2</option>
                        ` + list + `
                    </select>
                    </div>
                        <div class="bonus-dice flexrow" style="margin-bottom: 5px;">
                            <label>` + game.i18n.localize("tftloop.bonusDice") + `: </label>
                            <input name="bonusDice" type="text" value="" placeholder="0" data-dtype="Number"/>
                        </div>
                    </div>
                    <div class="bug"><img src="systems/tftloop/img/full_transparent.png" width="48" height="48"/></div>
                </div>
            `;

            let chatHTML = ``;

            // create dialog to get the use of item and or a bonus for dice
            let yesRoll = false;
            let d = new Dialog({
                title: game.i18n.localize("tftloop.diceRoll"),
                content: rollHTML,
                buttons: {
                    one: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("tftloop.roll"),
                        callback: () => {
                            yesRoll = true;
                        }
                    },
                    two: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize("tftloop.cancel"),
                        callback: () => {
                            data.dicePool = 0;
                        }
                    }
                },
                default: "two",
                render: _html => console.log("TFTLOOP | Rendering Dice Rolling Dialog"),
                close: async html => {
                    if (yesRoll) {
                        let itemBonus = Number(html.find('[name="useItem"]')[0].value);
                        let bonusDice = Number(html.find('[name="bonusDice"]')[0].value);
                        data.dicePool += itemBonus;
                        data.dicePool += bonusDice;
                        if (data.dicePool <= 0){
                            data.dicePool = 1;
                        }

                        let rollFormula = data.dicePool+"d6cs6";
                        
                        let r = new Roll(rollFormula, this.actor.data.data);
                        r.evaluate();

                        let rollValue = r.total;
                        let rollTooltip = await Promise.resolve(r.getTooltip());
                        let sucessText = game.i18n.localize("tftloop.failure");
                        if (rollValue > 0) {
                            sucessText = rollValue + " " + game.i18n.localize(
                                rollValue > 1 ? "tftloop.successes" : "tftloop.success"
                            );
                        }

                        let reRollDiceFormula = Number(data.dicePool - r.total);
                        
                        //TODO pull this out to a template.
                        chatHTML = `
                            <span class="flavor-text">
                                <div class="chat-header flexrow">
                                    <img class="portrait" width="48" height="48" src="` + this.actor.data.img + `"/>
                                    <h1>` + game.i18n.localize("tftloop.tested") + `: ` + game.i18n.localize("tftloop." + rolled) + `</h1>
                                </div>
                                <div class="tftloop chat-card" data-actor-id="` + actor.id + `">
                                <div class="dice-roll">
                                    <div class="dice-result">
                                        <div class="dice-formula">
                                            ` + r._formula + `
                                        </div>
                                            ` + rollTooltip + `
                                        <h4 class="dice-total">` + sucessText + `</h4>
                                    </div>
                                </div>
                                <div class="reroll-info" data-owner-id="` + actor.id + `">
                                    <button class="reroll" data-owner-id="` + actor.id + `" data-tested="` + game.i18n.localize("tftloop." + rolled) + `" data-dicepool="` + reRollDiceFormula + `" type="button">
                                        ` + game.i18n.localize("tftloop.reroll") + `
                                    </button>
                                </div>
                                </div>
                                <div class="bug"><img src="systems/tftloop/img/full_transparent.png" width="48" height="48"/></div>
                            </span>
                        `

                        data.dicePool = 0;

                        if (game.dice3d) {
                            game.dice3d.showForRoll(r, game.user, true, null, false);
                        }

                        let chatOptions = {
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor: this.actor, token: this.actor.img }),
                            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
                            roll: r,
                            rollMode: game.settings.get("core", "rollMode"),
                            content: chatHTML
                        }

                        ChatMessage.create(chatOptions);
                    } else {
                        data.dicePool = 0;
                    }
                }
            });

            d.render(true);
        } else {
            ui.notifications.info(game.i18n.localize("tftloop.brokeFail"));
        }
    }


    _onExpChange(event) {
        event.preventDefault();

        let actor = this.actor;
        let currentCount = this.actor.data.data.exp;
        
        let newCount = event.type == "click" ? Math.min(currentCount + 1, 10) : Math.max(currentCount - 1, 0);
        
        actor.update({ "data.exp" : newCount });
    }


    _resetLuck(event) {
        event.preventDefault();
        
        this.actor.update({ "data.luck.value": 0 });
    }


    _onUseLuck(event) {
        event.preventDefault();

        let actor = this.actor;
        let maxLuck = actor.data.data.luck.max;
        let usedLuck = actor.data.data.luck.value;
        
        if (usedLuck < maxLuck) {
            usedLuck += 1;
        } else {
            usedLuck = usedLuck;
        }

        actor.update({ "data.luck.value": usedLuck });
    }


    _onItemOpen(event) {
        event.preventDefault();

        let item = this.actor.getOwnedItem(event.currentTarget.closest(".item").dataset.itemId);
        item.sheet.render(true);
    }


    _onItemEdit(event) {
        event.preventDefault();

        let element = event.currentTarget;
        let item = this.actor.getOwnedItem(element.closest(".item").dataset.itemId);
        let field = element.dataset.field;
        
        return item.update({ [field]: element.value });
    }


    _onItemDelete(event) {
        event.preventDefault();
        let deleteId = [
            event.currentTarget.closest(".info-item").dataset.itemId
        ];
       
        return this.actor.deleteEmbeddedDocuments('Item', deleteId);
    }


    _onItemCreate(event) {
        event.preventDefault();

        let itemData = [{
            name: game.i18n.localize("tftloop.new"),
            type: event.currentTarget.dataset.type
        }];
        
       
        return this.actor.createEmbeddedDocuments('Item', itemData);
        
    }


    _onToggleClick(event) {
        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;
        let item = '';

        if (element.closest(".item")) {
            item = this.actor.getOwnedItem(element.closest(".item").dataset.itemId);
        }

        switch (element.dataset.toggle) {
            case "upset": 
                if (this.actor.data.data.upset) {
                    this.actor.data.data.upset = false;
                    actor.update({ "data.upset" : false });
                } else {
                    this.actor.data.data.upset = true;
                    actor.update({ "data.upset" : true });
                }

                break;
            case "scared":
                if (this.actor.data.data.scared) {
                    this.actor.data.data.scared = false;
                    actor.update({ "data.scared" : false });
                } else {
                    this.actor.data.data.scared = true;
                    actor.update({ "data.scared" : true });
                }

                break;
            case "exhausted":
                if (this.actor.data.data.exhausted) {
                    this.actor.data.data.exhausted = false;
                    actor.update({ "data.exhausted" : false });
                } else {
                    this.actor.data.data.exhausted = true;
                    actor.update({ "data.exhausted" : true });
                }

                break;
            case "injured":
                if (this.actor.data.data.injured) {
                    this.actor.data.data.injured = false;
                    actor.update({ "data.injured" : false });
                } else {
                    this.actor.data.data.injured = true;
                    actor.update({ "data.injured" : true });
                }

                break;
            case "broken":
                if (this.actor.data.data.broken) {
                    this.actor.data.data.broken = false;
                    actor.update({ "data.broken" : false });
                } else {
                    this.actor.data.data.broken = true;
                    actor.update({ "data.broken" : true });
                }

                break;
            case "prideCheck":
                if (this.actor.data.data.prideCheck) {
                    this.actor.data.data.prideCheck = false;
                    actor.update({ "data.prideCheck" : false });
                } else {
                    this.actor.data.data.prideCheck = true;
                    actor.update({ "data.prideCheck" : true });
                }

                break;
            case "accepted":
                if (item.data.data.accepted) {
                    item.data.data.accepted = false;
                    item.update({"data.accepted": false });
                } else {
                    item.data.data.accepted = true;
                    item.update({"data.accepted": true });
                }

                break;
            case "shameCheck":
                if (this.actor.data.data.shameCheck) {
                    this.actor.data.data.shameCheck = false;
                    actor.update({ "data.shameCheck" : false });
                } else {
                    this.actor.data.data.shameCheck = true;
                    actor.update({ "data.shameCheck" : true });
                }

                break;
        }
    }
}
