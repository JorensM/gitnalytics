global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  }),
) as jest.Mock;

jest.mock('next/navigation', () => ({
    redirect: (path: string) => {}
}))