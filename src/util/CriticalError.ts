
/**
 * A critical error is a type of error that may be affecting the system beyond
 * a single user. An error such as the database being down, malformed user data,
 * etc.
 */
export default class CriticalError extends Error {
    constructor(message: string) {
        super(message);
        this.alert();
    }

    alert() {

    }
}