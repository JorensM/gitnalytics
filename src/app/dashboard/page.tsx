import GitHubSignIn from '@/components/buttons/GitHubSignIn';
import GoogleSignIn from '@/components/buttons/GoogleSignIn';
import ReportForm, { GaProperties } from '@/components/ReportForm';
import { GitHubRepository } from '@/components/selects/GitHubRepositorySelect';
import { generateAccessTokenGoogle, isLoggedInToGitHub, isLoggedInToGoogle } from '@/util/auth';
import createStripeClient from '@/util/createStripeClient';
import { getSubscriptionActive } from '@/util/stripe';
import { createClient } from '@/util/supabase/server';
import moment from 'moment';
import Link from 'next/link';



function parseRelHeader(data: string) {
    let arrData = data.split("link:")
    data = arrData.length == 2? arrData[1]: data;
    let parsed_data: { [key: string]: string } = {}

    arrData = data.split(",")

    for (const d of arrData){
        const linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d)!;

        parsed_data[linkInfo[2]]=linkInfo[1]
    }

    return parsed_data;
}

export default async function DashboardPage() {

    const showReportForm = await isLoggedInToGitHub() && await isLoggedInToGoogle();

    const fetchProperties = async () => {
        console.log('fetching properties');
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        const token = user?.user_metadata.googleAccessToken;

        const accountsRes = await fetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {   
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token
            }
        })

        const accounts = (await accountsRes.json()).accounts;

        // console.log('accounts: ', accounts);

        let properties: any[] = [];

        for(const account of accounts) {
            const res = await fetch('https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:' + account.name, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': 'Bearer ' + token
                }
            })

            const data = await res.json();

            properties = properties.concat(data.properties);
        }


        console.log('properties: ', properties);
        return properties;
    }

    const fetchGithubRepositories = async () => {
            const supabase = await createClient();
            const { data: { user }, error } = await supabase.auth.getUser();
    
            if(error) {
                throw error;
            }
    
            const githubAccessToken = user?.user_metadata.githubAccessToken;
    
            let nextPageLink = null;
            let repos: GitHubRepository[] = [];

            do {
                const res: Response = await fetch(nextPageLink || 'https://api.github.com/user/repos?type=all', {
                    headers: {
                        'Accept': 'application/vnd.github+json',
                        'Authorization': 'Bearer ' + githubAccessToken,
                    }
                });

                const linkHeaderRaw = res.headers.get('link');

                const linkHeaderParsed = linkHeaderRaw ? parseRelHeader(linkHeaderRaw) : null;

                console.log(linkHeaderParsed);

                nextPageLink = linkHeaderParsed?.next;

                const data = await res.json();

                console.log('fetched repositories: ', data);

                repos = [...repos, ...data];
            } while (nextPageLink);

            return repos;
    }


    let properties: GaProperties = [];
    let repositories: GitHubRepository[] = [];

    const googleSignedIn = await isLoggedInToGoogle();
    const githubSignedIn = await isLoggedInToGitHub();
    
    if(googleSignedIn) {
        await generateAccessTokenGoogle();
        properties = await fetchProperties();
    }

    if(githubSignedIn) {
        repositories = await fetchGithubRepositories();
    }

    const isSubscriptionActive = await getSubscriptionActive();

    return (
        <div className='border border-neutral-600 p-4 bg-neutral-900 rounded-sm flex flex-col gap-4'>
            {isSubscriptionActive ? 
                <>
                    <h2>Generate Report</h2>
                    {!showReportForm ? 
                        <span className='text-sm text-neutral-400'>Please sign in to GitHub and Google to generate report</span>
                    : 
                        <ReportForm 
                            properties={properties}
                            repositories={repositories}
                        />
                    }
                </>
            : 
                'Your subscription has ended. Please renew in settings to continue using Gitnalytics'
            }
            
        </div>
    );
}