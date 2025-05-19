import '@/util/supabase/server'
import { Session, User } from '@supabase/supabase-js';

const defaultUser = {
    email: 'email@found.com',
    id: '4',
    user_metadata: {
        stripe_customer_id: 'stripe_customer_id'
    }
}

const defaultUsers = [defaultUser];

const supabaseConfig: {
    supabaseError: boolean,
    supabaseNoUser: boolean,
    users: any[],
    currentUser: Partial<User> | null,
    session: Partial<Session>
} = {
    supabaseError: false,
    supabaseNoUser: false,
    users: [...defaultUsers],
    currentUser: {...defaultUser},
    session: {
        access_token: '123'
    }
};

const supabaseResponse = (data: any, error?: string) => {
    return {
        data,
        error
    }
}

const _createClient = async () => ({
    auth: {
        getUser: async () => {
            if(supabaseConfig.supabaseError) {
                return {
                    data: {
                        user: null
                    },
                    error: 'error'
                }
            } if(supabaseConfig.supabaseNoUser) {
                return {
                    data: {
                        user: null
                    }
                }
            } else {
                // console.log('returning user: ', supabaseConfig.currentUser);
                return {
                    data: {
                        user: supabaseConfig.currentUser
                    }
                }
            }
        },
        getSession: async () => {
            return {
                data: { 
                    session: supabaseConfig.session
                }
            }
        },
        admin: {
            getUserById: async (id: string) => {
                const user = supabaseConfig.users.find(user => user.id === id);
                return {
                    data: { user },
                    error: !user ? 'User not found' : undefined
                }
            },
            deleteUser: async (id: string) => {
                const index = supabaseConfig.users.findIndex(user => user.id === id);
                supabaseConfig.users.splice(index, 1);
                return {
                    data: null
                }
            }
        },
        signOut: async () => {
            supabaseConfig.currentUser = null;
            return {};
        }
    },
    rpc: async (functionName: string, params: Record<string, any>) => {
        if(functionName === 'get_user_id_by_email') {
            if(params.p_email === 'email@found.com'){
                return {
                    data: '4'
                }
            } else {
                // todo check if this is actually what the rpc function returns when user is not found
                return {
                    data: null
                };
            }
        }
    }
})

jest.mock('../../util/supabase/server', () => ({ createClient: () => _createClient() }));

jest.mock('../../util/supabase/client', () => ({ createClient: () => _createClient() }))

beforeEach(() => {
    supabaseConfig.supabaseError = false;
    supabaseConfig.supabaseNoUser = false;
    supabaseConfig.currentUser = {...defaultUser};
    supabaseConfig.users = [...defaultUsers];
});

export default supabaseConfig;