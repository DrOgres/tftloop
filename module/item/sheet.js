export default class tftloopItemSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }


    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width : 650, 
            height: 350,
            classes: ["tftloop", "sheet", "item"],
            resizable: true, 
        });
    }


    get template() {
        const path = "systems/tftloop/templates/items";
        return `${path}/${this.item.data.type}.hbs`;
    }


    getData() {
        const data = super.getData();
        data.config = CONFIG.tftloop;
        return data;
    }
}
