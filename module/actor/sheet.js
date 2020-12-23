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


}