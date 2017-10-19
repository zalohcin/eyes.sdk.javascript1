'use strict';

/**
 * A base class for position related memento instances. This is intentionally
 * not an interface, since the mementos might vary in their interfaces.
 *
 * @abstract
 **/
class PositionMemento {
    constructor() {
        if (new.target === PositionMemento) {
            throw new TypeError("Can not construct `PositionMemento` instance directly, should be used implementation!");
        }
    }
}

module.exports = PositionMemento;
