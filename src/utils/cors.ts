import { whitelistDomains } from '../constants';

export const isOriginAllowed = (origin?: string) => {
  if (!origin) {
    // same origin...
    return true;
  }
  return whitelistDomains.some((domain) => origin.startsWith('http') && origin.endsWith(domain));
};
