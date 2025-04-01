import { GitClientAuthResponse } from './types';

/**
 * Abstract client for Git provider APIs such as GitHub, BitBucket, GitLab
 */
export default abstract class GitClient {
    /**
     * Generate URL for redirect to auth page
     */
    abstract authRedirectURL(): void;
    /**
     * Callback to run when user authorizes and is redirected back
     * to website
     * @param params Any params that might be required to confirm authorization
     * and retrieve tokens etc. 
     */
    abstract authCallback(...params: any[]): Promise<GitClientAuthResponse>
    /**
     * Revoke OAuth access for given Git provider
     */
    abstract revokeAccess(): Promise<void>;
}