"use strict";

class Kronkel extends CECanvas {
    constructor() {
        // Always call super first in constructor
        super({lx: -0.5, by: -0.5, rx: 1.5, ty: 1.5});
        this.n = this.getInt('n', 6);
        this.m = this.getObject('m',
                [
                    {x: 0.5, y: 0.5},
                    {x: 1.0, y: 0.0}
                ]);
        this.b = this.getObject('b',
                [
                    {x: 0.0, y: 0.0},
                    {x: 1.0, y: 0.0},
                    {x: 1.0, y: 1.0},
                    {x: 0.0, y: 1.0},
                    {x: 0.0, y: 0.0}
                ]);
        // Add the canvas to the shadow root.
        this.shadow.appendChild(this.canvas);
        this.updateRendering();
    }
    updateRendering() {
        const k = kronkel();
        k.show(this.canvas, this.bgcolor, this.fgcolor, this.win, this.n, this.m, this.b);
    }
}

class Mira extends CECanvas {
    constructor() {
        // Always call super first in constructor
        super({lx: -9.0, by: -10.5, rx: 12.0, ty: 6.5});
        this.i = this.getInt('i', 100000);
        this.x = this.getFloat('x', 4.0);
        this.y = this.getFloat('y', 0.0);
        this.a = this.getFloat('a', -0.48);
        this.b = this.getFloat('b', 0.94);
        // Add the canvas to the shadow root.
        this.shadow.appendChild(this.canvas);
        this.updateRendering();
    }
    static get observedAttributes() { return CECanvas.observedAttributes.concat('i', 'x', 'y', 'a', 'b'); }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "i":
                this.i = newValue;
                break;
            case "x":
                this.x = newValue;
                break;
            case "y":
                this.y = newValue;
                break;
            case "a":
                this.a = newValue;
                break;
            case "b":
                this.b = newValue;
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
                return;
        }
        this.updateRendering();
    }
    updateRendering() {
        const m = mira();
        m.show(this.canvas, this.bgcolor, this.fgcolor, this.win, this.i, this.x, this.y, this.a, this.b);
    }
}

class Stof extends CECanvas {
    constructor() {
        // Always call super first in constructor
        super({lx: -0.9, by: -0.7, rx: 1.5, ty: 1.1});
        this.n = this.getInt('n', 12);
        this.a = this.getFloat('a', 0.6);
        this.b = this.getFloat('b', 0.6);
        this.c = this.getFloat('c', 0.53);
        this.d = this.getFloat('d', 0.0);
        // Add the canvas to the shadow root.
        this.shadow.appendChild(this.canvas);
        this.updateRendering();
    }
    static get observedAttributes() { return CECanvas.observedAttributes.concat('n', 'a', 'b', 'c', 'd'); }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "n":
                this.n = newValue;
                break;
            case "a":
                this.a = newValue;
                break;
            case "b":
                this.b = newValue;
                break;
            case "c":
                this.c = newValue;
                break;
            case "d":
                this.d = newValue;
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
                return;
        }
        this.updateRendering();
    }
    updateRendering() {
        const s = stof();
        s.show(this.canvas, this.bgcolor, this.fgcolor, this.win, this.n, this.a, this.b, this.c, this.d);
    }
}

class Henon extends CECanvas {
    constructor() {
        // Always call super first in constructor
        super({lx: -1.2, by: -1.2, rx: 1.2, ty: 1.2});
        this.n = this.getInt('n', 10000);
        // Add the canvas to the shadow root.
        this.shadow.appendChild(this.canvas);
        this.updateRendering();
    }
    updateRendering() {
        const h = henon();
        h.show(this.canvas, this.bgcolor, this.fgcolor, this.win, this.n);
    }
}

addEventListener("load", function () {
    customElements.define('kronkel', Kronkel, { namespace: "http://mansoft.nl/fractal" });
    customElements.define('mira', Mira, { namespace: "http://mansoft.nl/fractal" });
    customElements.define('stof', Stof, { namespace: "http://mansoft.nl/fractal" });
    customElements.define('henon', Henon, { namespace: "http://mansoft.nl/fractal" });
});
