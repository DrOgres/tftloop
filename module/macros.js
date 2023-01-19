export function tftloopRoll(rollName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);

  console.log("macros tftloopRoll actor: ", actor);
  console.log("macros tftloopRoll rollName: ", rollName);

  let macroData = { actor: actor, rollName: rollName };
  // check to see if this was dropped from a character sheet if not do nothing

  Hooks.on("hotbarDrop", (bar, data, slot) => {
    
    console.log("macros hotbarDrop bar: ", bar);
    console.log("macros hotbarDrop data: ", data);
    console.log("macros hotbarDrop slot: ", slot);

    createRollMacro(macroData, slot)
    macroData = null;

});

  //createRollMacro(macroData, 3);
}

// parse and understand to make this work
export async function createRollMacro(data, slot) {
  console.log("macros createRollMacro data: ", data);
  console.log("maccros createRollMacro slot: ", slot);
  // data should be an actor that is owned by the user
  let actor = data.actor;

  console.log("macros createRollMacro actor: ", actor);
  if (!actor)
    return ui.notifications.error(
      "You can only create macro buttons for owned Actors"
    );

  const name = actor.name + " Test " + data.rollName;

  const command = `let myActor = game.actors.get("${actor.id}");
    myActor.sheet._poolBuilder("${data.rollName}", myActor); 
    `;

  console.log(
    "macros createRollMacro entities: ",
    game.macros.map((m) => m.name + " " + m.command)
  );
  let macro;

  game.macros.map((m) => {
    if (m.name === name && m.command === command) {
      console.log("macros createRollMacro macro exists: ", m);
      macro = m;
      return true;
    }
  });
  console.log("macros createRollMacro macro: ", macro);
  if (macro !== undefined) {
    console.log("macro already found, assigning to hotbar");
    game.user.assignHotbarMacro(macro, slot);
  } else {
    console.log("macro not found, creating new macro");
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
    console.log("macros createRollMacro macro: ", macro);
  game.user.assignHotbarMacro(macro, slot);
}
