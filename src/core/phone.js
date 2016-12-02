import PhoneFormat from 'phoneformat.js';
const isEmpty = value => value === undefined || value === null || value === '' || value === 'undefined';

export function isValidNumber(number) {
  return PhoneFormat.isValidNumber(number, US) || PhoneFormat.isValidNumber(number, AU);
}

const US = 'US';
const AU = 'AU';

/**
 * Formats a number to e164. Assumes that the phone is either a valid US/CA or AU number.
 */
export function formatE164(number) {
  if (!isEmpty(number)) {
    if (PhoneFormat.isValidNumber(number, US)) {
      return PhoneFormat.formatE164(US, number);
    }

    return PhoneFormat.formatE164(AU, number);
  }
}

/**
 * Gets the country of a number.
 *
 * @param number
 */
export function getCountry(number) {
  if (!isEmpty(number)) {
    if (PhoneFormat.isValidNumber(number, US)) {
      return US;
    } else if (PhoneFormat.isValidNumber(number, AU)) {
      return AU;
    }
  }
}

export function formatLocal(number) {
  return PhoneFormat.formatLocal(getCountry(number), number);
}

