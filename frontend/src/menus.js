
import { $t } from './services/i18n.js';

export const AppMenus = {
    
	navbarTopRight: [],
	navbarTopLeft: [],
	navbarSideLeft: [
  {
    "to": "/home",
    "label": $t('home'),
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/lovenodes",
    "label": $t('loveNodes'),
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/users",
    "label": $t('users'),
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
    
  },
  {
    "to": "/picture",
    "label": $t('picture'),
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
    
  }
],

    exportFormats: {
        print: {
			label: 'Print',
            icon: 'pi pi-print',
            type: 'print',
            ext: 'print',
        },
        pdf: {
			label: 'Pdf',
			
            icon: 'pi pi-file-pdf',
            type: 'pdf',
            ext: 'pdf',
        },
        excel: {
			label: 'Excel',
            icon: 'pi pi-file-excel',
            type: 'excel',
            ext: 'xlsx',
        },
        csv: {
			label: 'Csv',
            icon: 'pi pi-table',
            type: 'csv',
            ext: 'csv',
        },
    },
    locales: {
  "fr": "French",
  "ru": "Russian",
  "zh-CN": "Chinese",
  "en-US": "English",
  "it": "Italian",
  "hi": "Hindi",
  "pt": "Portuguese",
  "de": "German",
  "es": "Spanish",
  "ar": "Arabic"
}
}