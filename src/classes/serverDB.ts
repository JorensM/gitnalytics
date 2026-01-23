import SupabaseServer from "./SupabaseServer";
import AbstractDatabase from "./AbstractDatabase";

const database: AbstractDatabase = new SupabaseServer();

export default database;