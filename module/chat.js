export const hideChatActionButtons = function (_message, html, _data) {

  const card = html.querySelectorAll("div.tftloop.chat-card");
  
  if (card.length > 0) {
    let actor = game.actors.get(card[0].dataset.actorId);
    if (actor && !actor.isOwner) {
      const button = html.querySelectorAll("button.reroll");
      for (let i = 0; i<button.length; i++){
        button[i].style.display = "none";
      }
    }
  }
};

export function addChatListeners(html) {
  const button = html.querySelectorAll("button.reroll");
      for (let i = 0; i<button.length; i++){
        button[i].addEventListener('click', onReroll);
      }
  const formula = html.querySelectorAll("div.dice-formula");
  for (let i = 0; i<formula.length; i++){
    formula[i].addEventListener('click', onShowFormula);
  }
}




async function onShowFormula(event) {
  const card = event.currentTarget;
  const diceRoll = card.closest(".dice-roll");
  if (diceRoll.classList.contains("expanded")){
    diceRoll.classList.remove("expanded");
  } else {
  diceRoll.classList.add("expanded")
  }
}


//TODO add the sucesses from the first roll to the push 
async function onReroll(event) {
  const card = event.currentTarget;
  let actor = game.actors.get(card.dataset.ownerId);

  let dicePool = card.dataset.dicepool;
  let rollFormula = dicePool + "d6cs6";

  let rolled = card.dataset.tested;

  let r = new Roll(rollFormula, actor.system.data);
  await r.evaluate();

  let rollValue = r.total;
  let rollTooltip = await Promise.resolve(r.getTooltip());

  let sucessText = game.i18n.localize("tftloop.failure");

  if (rollValue > 0) {
    sucessText =
      rollValue +
      " " +
      game.i18n.localize(
        rollValue > 1 ? "tftloop.successes" : "tftloop.success"
      );
  }

  let reRollDiceFormula = Number(dicePool - r.total);

  // TODO: pull this out to a template.
  let chatHTML =
    `
        <span class="flavor-text">
            <div class="chat-header flexrow">
                <img class="portrait" width="48" height="48" src="` +
    actor.img +
    `"/>
                <h1>` +
    game.i18n.localize("tftloop.rerolled") +
    `: ` +
    rolled +
    `</h1>
            </div>
            
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
    rolled +
    `" data-dicepool="` +
    reRollDiceFormula +
    `" type="button">
                    ` +
    game.i18n.localize("tftloop.push") +
    `
                </button>
            </div>
            <div class="bug">
                <img src="systems/tftloop/img/full_transparent.png" width="48" height="48"/>
            </div>
        </span>
    `;
  // TODO version check this to use the correct chat options
  const version = game.data.version || game.version;
  console.log("Version: " + version);
  let chatOptions = {};
  if (version > 12) {
    chatOptions = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor, token: actor.img }),
      rolls: [r],
      content: chatHTML,
    };
  } else {
    chatOptions = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor, token: actor.img }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: r,
      content: chatHTML,
    };
  }

  ChatMessage.applyRollMode(chatOptions, game.settings.get("core", "rollMode"));
  await ChatMessage.create(chatOptions);
}
