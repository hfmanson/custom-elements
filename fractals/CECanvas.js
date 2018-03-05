"use strict";

class AttrUtils extends HTMLElement {
    getString(attrName, dflt) {
        const value = this.getAttribute(attrName);
        return value ? value : dflt;
    }
    getInt(attrName, dflt) {
        const value = this.getAttribute(attrName);
        return value ? parseInt(value) : dflt;
    }
    getFloat(attrName, dflt) {
        const value = this.getAttribute(attrName);
        return value ? parseFloat(value) : dflt;
    }
    getObject(attrName, dflt) {
        const value = this.getAttribute(attrName);
        return value ? JSON.parse(value) : dflt;
    }
    updateRendering() {
    }
};

class CECanvas extends AttrUtils {
    constructor(win = {lx: -1, by: -1, rx: 1, ty: 1}, bgcolor="black", fgcolor="white") {
        // Always call super first in constructor
        super();
        // Create a shadow root
        // v1 this.shadow = this.attachShadow({mode: 'open'});
        this.shadow = this;
        // Create a standard canvas element and set it's attributes.
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.getAttribute('width');
        this.canvas.height = this.getAttribute('height');
        this.bgcolor = this.getString('bgcolor', bgcolor);
        this.fgcolor = this.getString('fgcolor', fgcolor);
        this.win = this.getObject('window', win);
/*
        const channel = this.getAttribute("channel");
        if (channel) {
            new BroadcastChannel(channel).addEventListener("message", (ev) => {
                const data = ev.data;
                if (data.attribute && data.value ) {
                    this.setAttribute(data.attribute, data.value);
                }
            }, false);
        }
*/
    }
    static get observedAttributes() { return ["bgcolor", "fgcolor" ]; }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "bgcolor":
                this.bgcolor = newValue;
                break;
            case "fgcolor":
                this.fgcolor = newValue;
                break;
        }
        this.updateRendering();
    }
}
