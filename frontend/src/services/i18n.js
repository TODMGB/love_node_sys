

import { StorageService } from 'src/services/storage';

const locale = StorageService.getLocale() || process.env.VUE_APP_LOCALE;
let messages = {};
try {
  messages = require(`@/i18n/${locale}.json`);
}
catch (err) {
  console.error(err);
}

const i18n = {
  locale,
  messages,
  t: function (key, args) {
    let value = key.split('.').reduce((p, c) => p?.[c], messages);
    if (value && args) {
      const names = Object.keys(args);
      const vals = Object.values(args);
      return new Function(...names, `return \`${value}\`;`)(...vals);
    }
    return value || key;
  }
};

const $t = i18n.t;
export { i18n, $t }

