import { ChangeEvent, useState } from 'react';
import { GaProperties } from '../ReportForm';

type GaPropertySelectProps = {
    properties: GaProperties
    onChange: (propertyName: string) => void,
    defaultValue: string
}

export default function GaPropertySelect( { properties, onChange, defaultValue }: GaPropertySelectProps) {

    // const properties = fetchProperties();

    const [value, setValue] = useState<string>(defaultValue);

    // console.log('properties: ' + properties);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setValue(e.currentTarget.value);
        onChange(e.currentTarget.value);
    }

    return (
        <select 
            onChange={handleChange}
            value={value}
        >
            {properties.map((property) => (
                <option value={property.name}>
                    {property.displayName}
                </option>
            ))}
        </select>
    )
}