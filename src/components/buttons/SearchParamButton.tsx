'use client';
type SearchParamButtonProps = {
    params: Record<string, string>,
    default: string
}

export default function SearchParamButton(props: SearchParamButtonProps) {

    const params = useSearchParams();

    const paramKey = Object.keys(props.params)[0];

    const label = params.get(paramKey) ? props.params[paramKey] : props.default;

    return <button>{label}</button>;
}