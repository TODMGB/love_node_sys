import * as validators from '@vuelidate/validators'
import { $t } from './i18n.js';

const { createI18nMessage } = validators;
const withI18nMessage = createI18nMessage({ t: $t });

export const required = withI18nMessage(validators.required);
export const email = withI18nMessage(validators.email);
export const ipAddress = withI18nMessage(validators.ipAddress);
export const numeric = withI18nMessage(validators.numeric);

export const minLength = withI18nMessage(validators.minLength, { withArguments: true });

export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true });
export const minValue = withI18nMessage(validators.minValue, { withArguments: true });
export const maxValue = withI18nMessage(validators.maxValue, { withArguments: true });
export const sameAs = withI18nMessage(validators.sameAs, { withArguments: true });

export const helpers = validators.helpers;