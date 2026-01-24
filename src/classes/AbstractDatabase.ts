import { User } from '@supabase/auth-js';


export type UserAttributes = {
    password: string
}

export default abstract class AbstractDatabase {

    abstract init(): Promise<boolean>;

    abstract signUp(email: string, password: string, stripeCustomerId: string): Promise<User | null>
    abstract signIn(email: string, password: string): Promise<boolean>;
    abstract signOut(): Promise<boolean>;
    abstract getUser(): Promise<User | null>;
    abstract updateUser(attributes: UserAttributes): Promise<boolean>;


}