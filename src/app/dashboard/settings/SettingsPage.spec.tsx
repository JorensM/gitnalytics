import SettingsPage from './page'
import { act, render, screen } from '@testing-library/react';

describe('<SettingsPage/>', () => {
    it('Should have a delete account button', () => {
        act(async () => {
            render(<SettingsPage/>);
    
            const deleteButton = await screen.findByText('Delete Account');
    
            expect(deleteButton.tagName).toBe('BUTTON');
        })
    })
})