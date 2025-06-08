'use client';
type SearchParamButtonProps = {
    params: Record<string, string>,
    default: string
}

// WIP
// A button that changes its label based on current URL search params
export default function SearchParamButton(props: SearchParamButtonProps) {

    // const params = useSearchParams();

    // const paramKey = Object.keys(props.params)[0];

    const label = props.default;//params.get(paramKey) ? props.params[paramKey] : props.default;

    return <button>{label}</button>;
}