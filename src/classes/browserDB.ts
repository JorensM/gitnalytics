import AbstractDatabase from "./AbstractDatabase";
import SupabaseBrowser from "./SupabaseBrowser";

/**
 * Default database to use
 */
const database: AbstractDatabase = new SupabaseBrowser();

database.init();

export default database;