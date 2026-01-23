export default abstract class AbstractDatabase {

    abstract init(): Promise<boolean>;

    abstract signIn(email: string, password: string): Promise<boolean>;
}