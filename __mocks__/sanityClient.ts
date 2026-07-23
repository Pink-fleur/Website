export const sanityClient = {
  fetch: jest.fn().mockResolvedValue(null),
}

export function urlFor(source: unknown) {
  return {
    width: () => ({ height: () => ({ fit: () => ({ url: () => '/images/beneficiaries/b-1.jpg' }) }) }),
    url: () => '/images/beneficiaries/b-1.jpg',
  }
}
