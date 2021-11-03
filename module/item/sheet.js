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
        return `systems/tftloop/templates/items/${this.item.data.type}.hbs`;
    }


    getData() {
        const data = super.getData();
        data.config = CONFIG.tftloop;
        
        return data;
    }
}
