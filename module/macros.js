export function tftloopRoll(rollName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  let macroData = { actor: actor, rollName: rollName };
  // check to see if this was dropped from a character sheet if not do nothing

  Hooks.on("hotbarDrop", (bar, data, slot) => {
    createRollMacro(macroData, slot);
    
  });
}

export async function createRollMacro(data, slot) {
  // data should be an actor that is owned by the user
  let actor = data.actor;
  if (!actor)
    return ui.notifications.error(
      "You can only create macro buttons for owned Actors"
    );

  const name = actor.name + ", Test: " + data.rollName;
  const command = `let myActor = game.actors.get("${actor.id}");myActor.sheet._poolBuilder("${data.rollName}",myActor);`;
  let macro;

  game.macros.map((m) => {
    if (m.name === name && m.command === command) {
      macro = m;
      return true;
    }
  });
  if (macro !== undefined) {
    game.user.assignHotbarMacro(macro, slot);
  } else {
    macro = await Macro.create(
      {
        name: name,
        type: "script",
        command: command,
        flags: { "tftloop.rollMacro": true },
      },
      { displaySheet: false }
    );
  }
  game.user.assignHotbarMacro(macro, slot);
}
