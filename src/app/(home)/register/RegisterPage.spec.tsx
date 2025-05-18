import { render, screen } from '@testing-library/react';
import RegisterPage from './page';

describe('<RegisterPage />', () => {
    it('Should show error message if error param is set', () => {
        render(<RegisterPage/>);
    })
})