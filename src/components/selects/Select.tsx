import { ChangeEvent, useState } from 'react';

type SelectOption = {
    value: string,
    label: string
}

type SelectProps = {
    defaultValue?: string,
    onChange?: (value: string) => void,
    options: SelectOption[]
}

export default function Select(props: SelectProps) {
    const [value, setValue] = useState<string | undefined>(props.defaultValue);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setValue(e.currentTarget.value);
        if(props.onChange) {
            props.onChange(e.currentTarget.value);
        }
    }

    return (
        <select
            value={value}
            onChange={handleChange}
        >
            {props.options.map(option => (
                <option value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}