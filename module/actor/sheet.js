import { tftloopRoll } from "../macros.js";

export default class tftloopActorSheet extends ActorSheet {
  static get defaultOptions() {
    let loopOptions = super.defaultOptions;

    loopOptions.template = "systems/tftloop/templates/actors/character.hbs";
    loopOptions.classes.push("tftloop");
    loopOptions.classes.push("sheet");
    loopOptions.classes.push("actor");
    loopOptions.classes.push("character");
    loopOptions.classes.push("kid");
    loopOptions.width = 800;
    loopOptions.height = 950;
    loopOptions.tabs = [
      {
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "main",
      },
    ];
    loopOptions.dragDrop.push({
      dragSelector: ".attribute-list .attribute",
      dropSelector: null,
    });
    loopOptions.dragDrop.push({
      dragSelector: ".skill-list .skill",
      dropSelector: null,
    });

    return loopOptions;
  }

  get template() {
    return `systems/tftloop/templates/actors/${this.actor.type}.hbs`;
  }

  getData() {
    const sheet = super.getData();
    sheet.config = CONFIG.tftloop;
    const actor = this.actor;

    sheet.relationships = sheet.items.filter(function (item) {
      return item.type == "relationship";
    });

    sheet.bonusItems = sheet.items.filter(function (item) {
      return item.type == "item";
    });

    if (actor.type == "teen") {
      sheet.scars = sheet.items.filter(function (item) {
        return item.type == "scar";
      });
    }

    // set the max luck to change the number of boxes we draw on the sheet data.system.luck.max
    if (actor.type == "kid") {
      const maxLuck = 15 - Number(sheet.data.system.age);
      const curLuck = maxLuck - sheet.data.system.luck.value;
      actor.update({ "system.luck.max": maxLuck });
      actor.update({ "system.curLuck": curLuck });
    }

    sheet.francein80s = game.settings.get("tftloop", "francein80s")
      ? true
      : false;
    sheet.polishedition = game.settings.get("tftloop", "polishedition")
      ? true
      : false;

    return sheet;
  }

  activateListeners(html) {
    if (this.isEditable) {
      html.find(".reset-luck").click(this._resetLuck.bind(this));
      html.find(".use-luck").click(this._onUseLuck.bind(this));
      html.find(".toggle-boolean").click(this._onToggleClick.bind(this));
      html.find(".item-create").click(this._onItemCreate.bind(this));
      html.find(".inline-edit").change(this._onItemEdit.bind(this));
      html.find(".item-delete").click(this._onItemDelete.bind(this));
      html
        .find(".exp-boxes")
        .on("click contextmenu", this._onExpChange.bind(this));
      html.find(".item-open").click(this._onItemOpen.bind(this));
      html.find(".sheet-body").on("drop", this._onItemDrop.bind(this));
      html.find(".item").on("drag", this._onItemDrag.bind(this));
    }

    if (this.actor.isOwner) {
      html.find(".add-to-pool").click(this._onAddToPool.bind(this));
    }

    super.activateListeners(html);
  }

  _onDragStart(event) {
    console.log(
      "start drag",
      event.srcElement.firstElementChild.dataset.rolled
    );
    console.log(
      "start drag skill?",
      event.currentTarget.classList.contains("skill")
    );
    console.log(
      "start drag attribute?",
      event.currentTarget.classList.contains("attribute")
    );

    if (
      event.currentTarget.classList.contains("skill") ||
      event.currentTarget.classList.contains("attribute")
    ) {
      console.log("a skill or attribute");
      const rollItemDragged = event.srcElement.firstElementChild.dataset.rolled;
      console.log("rollItemDragged", rollItemDragged);

      tftloopRoll(rollItemDragged);

      return;
    } else {
      console.log("not a skill or attribute");
      super._onDragStart(event);
      return;
    }
  }

  _onItemDrag(event) {
    event.preventDefault();

    game.data.item = this.actor.getEmbeddedDocument(
      "Item",
      event.currentTarget.closest(".item").dataset.itemId
    );
  }

  _onItemDrop(event) {
    event.preventDefault();

    let actor = this.actor;
    let storedItem = game.data.item;

    if (storedItem && storedItem.actor != actor) {
      let itemData = [
        {
          name: storedItem.name,
          type: storedItem.type,
          system: {
            description: storedItem.system.description,
            notes: storedItem.system.notes,
          },
        },
      ];
      return actor.createEmbeddedDocuments("Item", itemData);
    }

    return;
  }

  async _poolBuilder(rolled, actor) {
    let data = actor.system;
    let items = actor.items.filter(function (item) {
      return item.type == "item";
    });

    console.log("pool builder", rolled, data);

    let statRolled = "";
    let conditionPenalty = "";

    // if we are broken then we fail no matter what.
    if (!data.broken) {
      //see what we rolled on and set up initial dice pool
      switch (rolled) {
        case "body":
          console.log(data.body);
          data.dicePool += data.body;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.body") +
            " +" +
            data.body +
            "</div>";
          break;
        case "tech":
          data.dicePool += data.tech;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.tech") +
            " +" +
            data.tech +
            "</div>";
          break;
        case "heart":
          data.dicePool += data.heart;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.heart") +
            " +" +
            data.heart +
            "</div>";
          break;
        case "mind":
          data.dicePool += data.mind;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.mind") +
            " +" +
            data.mind +
            "</div>";
          break;
        case "sneak":
          data.dicePool += data.body;
          data.dicePool += data.sneak;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.body") +
            " +" +
            data.body +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.sneak") +
            " +" +
            data.sneak +
            "</div>";
          break;
        case "force":
          data.dicePool += data.body;
          data.dicePool += data.force;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.body") +
            " +" +
            data.body +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.force") +
            " +" +
            data.force +
            "</div>";
          break;
        case "move":
          data.dicePool += data.body;
          data.dicePool += data.move;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.body") +
            " +" +
            data.body +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.move") +
            " +" +
            data.move +
            "</div>";
          break;
        case "tinker":
          data.dicePool += data.tech;
          data.dicePool += data.tinker;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.tech") +
            " +" +
            data.tech +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.tinker") +
            " +" +
            data.tinker +
            "</div>";
          break;
        case "program":
          data.dicePool += data.tech;
          data.dicePool += data.program;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.tech") +
            " +" +
            data.tech +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.program") +
            " +" +
            data.program +
            "</div>";
          break;
        case "calculate":
          data.dicePool += data.tech;
          data.dicePool += data.calculate;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.tech") +
            " +" +
            data.tech +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.calculate") +
            " +" +
            data.calculate +
            "</div>";
          break;
        case "contact":
          data.dicePool += data.heart;
          data.dicePool += data.contact;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.heart") +
            " +" +
            data.heart +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.contact") +
            " +" +
            data.contact +
            "</div>";
          break;
        case "charm":
          data.dicePool += data.heart;
          data.dicePool += data.charm;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.heart") +
            " +" +
            data.heart +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.charm") +
            " +" +
            data.charm +
            "</div>";
          break;
        case "lead":
          data.dicePool += data.heart;
          data.dicePool += data.lead;

          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.heart") +
            " +" +
            data.heart +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.lead") +
            " +" +
            data.lead +
            "</div>";
          break;
        case "investigate":
          data.dicePool += data.mind;
          data.dicePool += data.investigate;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.mind") +
            " +" +
            data.mind +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.investigate") +
            " +" +
            data.investigate +
            "</div>";
          break;
        case "comprehend":
          data.dicePool += data.mind;
          data.dicePool += data.comprehend;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.mind") +
            " +" +
            data.mind +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.comprehend") +
            " +" +
            data.comprehend +
            "</div>";
          break;
        case "empathize":
          data.dicePool += data.mind;
          data.dicePool += data.empathize;
          statRolled =
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.mind") +
            " +" +
            data.mind +
            "</div>";
          statRolled +=
            '<div class="pool-detail">' +
            game.i18n.localize("tftloop.empathize") +
            " +" +
            data.empathize +
            "</div>";
          break;
      }
      console.log("tftloop| dice pool pre conditions: ", data.dicePool);
      //reduce dice by conditions
      if (data.upset) {
        data.dicePool = data.dicePool - 1;
        console.log("tftloop| dice pool post upset: ", data.dicePool);
        conditionPenalty +=
          '<div class="pool-detail penalty">' +
          game.i18n.localize("tftloop.upset") +
          " -1</div>";
      }

      if (data.scared) {
        data.dicePool = data.dicePool - 1;
        conditionPenalty +=
          '<div class="pool-detail penalty">' +
          game.i18n.localize("tftloop.scared") +
          " -1</div>";
      }

      if (data.exhausted) {
        data.dicePool = data.dicePool - 1;
        conditionPenalty +=
          '<div class="pool-detail penalty">' +
          game.i18n.localize("tftloop.exhausted") +
          " -1</div>";
      }

      if (data.injured) {
        data.dicePool = data.dicePool - 1;
        conditionPenalty +=
          '<div class="pool-detail penalty">' +
          game.i18n.localize("tftloop.injured") +
          " -1</div>";
      }

      console.log("tftloop| dice pool post conditions: ", data.dicePool);
      
      let poolTotal = 0
      if(data.dicePool <= 0) {
        poolTotal = 1;
      } else {
        poolTotal = data.dicePool;
      };
      // next set up the dialog to allow the player to select an item and add any bonus dice
      // build the html for the roll dialog
      let rollHTML = `
                <div class="form-group">
                    <h2>${game.i18n.localize(
                      "tftloop.rolling"
                    )}: ${game.i18n.localize("tftloop." + rolled)}</h2>
                    <div class="pool-count">${game.i18n.localize(
                      "tftloop.currentPool"
                    )}: ${poolTotal} ${game.i18n.localize(
                      "tftloop.dice"
                    )}</div>
                    <div class="pool-details">
                        ${statRolled}
                    
                        ${conditionPenalty}
                    <div class="divider"></div>
                    <div class="pool-item-select">
                    <label for="roll-item">${game.i18n.localize(
                      "tftloop.useItem"
                    )}:</label>
                    <select id="roll-item" name="useItem" style="margin-bottom: 5px">
                        <option value="0">${game.i18n.localize(
                          "tftloop.none"
                        )}</option>
                        <option value="2">${game.i18n.localize(
                          "tftloop.iconic"
                        )}${data.iconicItem.desc} + 2</option>
                        ${items.map(
                          (item) =>
                            '<option value="' +
                            item.system.bonus +
                            '">' +
                            item.name +
                            " + " +
                            item.system.bonus +
                            "</option>"
                        )}
                    </select>
                    </div>
                        <div class="bonus-dice flexrow" style="margin-bottom: 5px;">
                            <label>${game.i18n.localize(
                              "tftloop.bonusDice"
                            )}: </label>
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
            },
          },
          two: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("tftloop.cancel"),
            callback: () => {
              data.dicePool = 0;
            },
          },
        },
        default: "two",
        render: (_html) =>
          console.log("TFTLOOP | Rendering Dice Rolling Dialog"),
        close: async (html) => {
          if (yesRoll) {
            let itemBonus = Number(html.find('[name="useItem"]')[0].value);
            let bonusDice = Number(html.find('[name="bonusDice"]')[0].value);
            data.dicePool += itemBonus;
            data.dicePool += bonusDice;
            if (data.dicePool <= 0) {
              data.dicePool = 1;
            }

            let rollFormula = data.dicePool + "d6cs6";

            // console.log("TFTLOOP | Rolling Dice: " + this.actor);

            let r = new Roll(rollFormula, this.actor.system.data);
            await r.evaluate();

            let rollValue = r.total;
            let rollTooltip = await Promise.resolve(r.getTooltip());
            let sucessText = game.i18n.localize("tftloop.failure");
            if (rollValue > 0) {
              // console.log("DICE ROLL success");
              sucessText =
                rollValue +
                " " +
                game.i18n.localize(
                  rollValue > 1 ? "tftloop.successes" : "tftloop.success"
                );
            }

            let reRollDiceFormula = Number(data.dicePool - r.total);

            //TODO pull this out to a template.
            chatHTML =
              `
                            <span class="flavor-text">
                                <div class="chat-header flexrow">
                                    <img class="portrait" width="48" height="48" src="` +
              this.actor.img +
              `"/>
                                    <h1>` +
              game.i18n.localize("tftloop.tested") +
              `: ` +
              game.i18n.localize("tftloop." + rolled) +
              `</h1>
                                </div>
                                <div class="tftloop chat-card" data-actor-id="` +
              actor.id +
              `">
                                <div class="dice-roll">
                                    <div class="dice-result">
                                        <div class="dice-formula">
                                            ` +
              r._formula +
              `
                                        </div>
                                            ` +
              rollTooltip +
              `
                                        <h4 class="dice-total">` +
              sucessText +
              `</h4>
                                    </div>
                                </div>
                                <div class="reroll-info" data-owner-id="` +
              actor.id +
              `">
                                    <button class="reroll" data-owner-id="` +
              actor.id +
              `" data-tested="` +
              game.i18n.localize("tftloop." + rolled) +
              `" data-dicepool="` +
              reRollDiceFormula +
              `" type="button">
                                        ` +
              game.i18n.localize("tftloop.push") +
              `
                                    </button>
                                </div>
                                </div>
                                <div class="bug"><img src="systems/tftloop/img/full_transparent.png" width="48" height="48"/></div>
                            </span>
                        `;

            data.dicePool = 0;

            let chatOptions = {
              user: game.user.id,
              speaker: ChatMessage.getSpeaker({
                actor: this.actor,
                token: this.actor.img,
              }),
              type: CONST.CHAT_MESSAGE_TYPES.ROLL,
              roll: r,
              content: chatHTML,
            };
            ChatMessage.applyRollMode(chatOptions, game.settings.get('core', 'rollMode'));
            await ChatMessage.create(chatOptions);
          } else {
            data.dicePool = 0;
          }
        },
      });

      d.render(true);
    } else {
      ui.notifications.info(game.i18n.localize("tftloop.brokeFail"));
    }
  }

  async _onAddToPool(event) {
    event.preventDefault();

    let actor = this.actor;
    let element = event.currentTarget;
    let rolled = element.dataset.rolled;

    await this._poolBuilder(rolled, actor);
  }

  _onExpChange(event) {
    event.preventDefault();

    let actor = this.actor;
    let currentCount = actor.system.exp;

    let newCount =
      event.type == "click"
        ? Math.min(currentCount + 1, 10)
        : Math.max(currentCount - 1, 0);

    actor.update({ "data.exp": newCount });
  }

  _resetLuck(event) {
    event.preventDefault();

    this.actor.update({ "system.luck.value": 0 });
  }

  _onUseLuck(event) {
    event.preventDefault();

    let actor = this.actor;
    let maxLuck = actor.system.luck.max;
    let usedLuck = actor.system.luck.value;

    if (usedLuck < maxLuck) {
      usedLuck += 1;
    } else {
      usedLuck = usedLuck;
    }

    actor.update({ "system.luck.value": usedLuck });
  }

  _onItemOpen(event) {
    event.preventDefault();

    let item = this.actor.getEmbeddedDocument(
      "Item",
      event.currentTarget.closest(".item").dataset.itemId
    );
    item.sheet.render(true);
  }

  _onItemEdit(event) {
    event.preventDefault();
    // console.log(event);
    let element = event.currentTarget;
    let item = this.actor.getEmbeddedDocument(
      "Item",
      element.closest(".item").dataset.itemId
    );

    // console.log(item);
    let field = element.dataset.field;
    // console.log(field);

    return item.update({ [field]: element.value });
  }

  _onItemDelete(event) {
    event.preventDefault();
    let deleteId = [event.currentTarget.closest(".info-item").dataset.itemId];

    return this.actor.deleteEmbeddedDocuments("Item", deleteId);
  }

  _onItemCreate(event) {
    event.preventDefault();

    let itemData = [
      {
        name: game.i18n.localize("tftloop.new"),
        type: event.currentTarget.dataset.type,
      },
    ];

    return this.actor.createEmbeddedDocuments("Item", itemData);
  }

  _onToggleClick(event) {
    event.preventDefault();

    let element = event.currentTarget;
    let actor = this.actor;
    let item = "";

    if (element.closest(".item")) {
      item = this.actor.getEmbeddedDocument(
        "Item",
        element.closest(".item").dataset.itemId
      );
    }

    switch (element.dataset.toggle) {
      case "upset":
        if (this.actor.system.upset) {
          this.actor.system.upset = false;
          actor.update({ "system.upset": false });
        } else {
          this.actor.system.upset = true;
          actor.update({ "system.upset": true });
        }

        break;
      case "scared":
        if (this.actor.system.scared) {
          this.actor.system.scared = false;
          actor.update({ "system.scared": false });
        } else {
          this.actor.system.scared = true;
          actor.update({ "system.scared": true });
        }

        break;
      case "exhausted":
        if (this.actor.system.exhausted) {
          this.actor.system.exhausted = false;
          actor.update({ "system.exhausted": false });
        } else {
          this.actor.system.exhausted = true;
          actor.update({ "system.exhausted": true });
        }

        break;
      case "injured":
        if (this.actor.system.injured) {
          this.actor.system.injured = false;
          actor.update({ "system.injured": false });
        } else {
          this.actor.system.injured = true;
          actor.update({ "system.injured": true });
        }

        break;
      case "broken":
        if (this.actor.system.broken) {
          this.actor.system.broken = false;
          actor.update({ "system.broken": false });
        } else {
          this.actor.system.broken = true;
          actor.update({ "system.broken": true });
        }

        break;
      case "prideCheck":
        if (this.actor.system.prideCheck) {
          this.actor.system.prideCheck = false;
          actor.update({ "system.prideCheck": false });
        } else {
          this.actor.system.prideCheck = true;
          actor.update({ "system.prideCheck": true });
        }

        break;
      case "accepted":
        // console.log(item);
        if (item.system.accepted) {
          item.system.accepted = false;
          item.update({ "system.accepted": false });
        } else {
          item.system.accepted = true;
          item.update({ "system.accepted": true });
        }

        break;
      case "shameCheck":
        if (this.actor.system.shameCheck) {
          this.actor.system.shameCheck = false;
          actor.update({ "system.shameCheck": false });
        } else {
          this.actor.system.shameCheck = true;
          actor.update({ "system.shameCheck": true });
        }

        break;
    }
  }
}
