import CriticalError from './CriticalError'

describe('CriticalError', () => {
    it('Should call .alert()', () => {
        const alertSpy = jest.spyOn(CriticalError.prototype, 'alert');

        new CriticalError('test');

        expect(alertSpy).toHaveBeenCalled();
    })

    describe('.alert()', () => {
        it.todo('Should alert developers about the error');
    })
})