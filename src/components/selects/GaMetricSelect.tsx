import { GA_METRICS } from '@/constants/googleAnalytics';
import Select from './Select';

type GaMetricSelect = {
    defaultValue: string,
    onChange: (value: string) => void
}

export default function GaMetricSelect(props: GaMetricSelect) {
    return (
        <Select
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            options={GA_METRICS}
        />
    );
}