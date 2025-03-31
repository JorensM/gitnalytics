import { createClient } from '@/util/supabase/server';
import { ChangeEvent, useState } from 'react';

export type GitHubRepository = {
    full_name: string
}

type GitHubRepositorySelectProps = {
    repositories: GitHubRepository[],
    defaultValue?: string,
    onChange?: (repoFullName: string) => void,
    name?: string
}

export default function GitHubRepositorySelect( props: GitHubRepositorySelectProps ) {

    const [value, setValue] = useState<string>(props.defaultValue || props.repositories[0].full_name);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.currentTarget.value;
        setValue(newValue);
        if(props.onChange) {
            props.onChange(newValue);
        }
    }

    return (
        <select
            onChange={handleChange}
            value={value}
            name={props.name}
        >
            {props.repositories.map(repo => (
                <option value={repo.full_name}>{repo.full_name}</option>
            ))}
        </select>
    );
}