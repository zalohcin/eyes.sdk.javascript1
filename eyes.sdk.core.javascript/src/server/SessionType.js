'use strict';

/**
 * The type of the session.
 *
 * @readonly
 * @enum {Number}
 */
const SessionType = {
    /**
     * Default type of sessions.
     */
    SEQUENTIAL: 1,

    /**
     * A timing test session
     */
    PROGRESSION: 2
};

Object.freeze(SessionType);
module.exports = SessionType;
