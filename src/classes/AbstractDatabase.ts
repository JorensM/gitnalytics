
type UserAttributes = {
    password: string
}

export default abstract class AbstractDatabase {

    abstract init(): Promise<boolean>;

    abstract signIn(email: string, password: string): Promise<boolean>;
    abstract signOut(): Promise<boolean>;
    abstract updateUser(attributes: UserAttributes): Promise<boolean>;

}