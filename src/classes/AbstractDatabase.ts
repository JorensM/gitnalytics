import { User as SupabaseUser} from '@supabase/auth-js';

export type UserData = {
    githubAccessToken: string | null,
    googleRefreshToken: string | null,
    googleAccessToken: string | null
}

export type UserAttributes = {
    password: string,
    data: Partial<UserData>
}

export type User = SupabaseUser & {
    // data: Partial<UserData>
}

export default abstract class AbstractDatabase {

    abstract init(): Promise<boolean>;

    abstract signUp(email: string, password: string, stripeCustomerId: string): Promise<User | null>
    abstract signIn(email: string, password: string): Promise<boolean>;
    abstract signOut(): Promise<boolean>;
    abstract getUser(): Promise<User | null>;
    abstract updateUser(attributes: Partial<UserAttributes>): Promise<boolean>;


}