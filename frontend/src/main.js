import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/styles/layout.scss';

import { createApp, reactive } from 'vue';
import { createPinia } from 'pinia'
import Router from './router';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Avatar from 'primevue/avatar';
import Editor from 'primevue/editor';
import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import Carousel from 'primevue/carousel';
import Chart from 'primevue/chart';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import Chips from 'primevue/chips';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import Listbox from 'primevue/listbox';
import Fieldset from 'primevue/fieldset';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import InlineMessage from 'primevue/inlinemessage';
import Inplace from 'primevue/inplace';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Knob from 'primevue/knob';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import OverlayPanel from 'primevue/overlaypanel';
import Paginator from 'primevue/paginator';
import Password from 'primevue/password';
import ProgressBar from 'primevue/progressbar';
import Rating from 'primevue/rating';
import RadioButton from 'primevue/radiobutton';
import Ripple from 'primevue/ripple';
import SelectButton from 'primevue/selectbutton';
import ScrollPanel from 'primevue/scrollpanel';
import Panel from 'primevue/panel';
import BlockUI from 'primevue/blockui';
import ScrollTop from 'primevue/scrolltop';
import Slider from 'primevue/slider';
import Sidebar from 'primevue/sidebar';
import Skeleton from 'primevue/skeleton';
import SplitButton from 'primevue/splitbutton';
import StyleClass from 'primevue/styleclass';
import TabMenu from 'primevue/tabmenu';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Toolbar from 'primevue/toolbar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Tooltip from 'primevue/tooltip';
import ToggleButton from 'primevue/togglebutton';
import ProgressSpinner from 'primevue/progressspinner';


import NiceImage from './components/NiceImage.vue';
import AutoCompleteSelect from './components/AutoCompleteSelect.vue';
import PageSearch from './components/PageSearch.vue';
import Uploader from './components/Uploader.vue';
import ApiDataSource from './components/ApiDataSource.vue';
import RecordCount from './components/RecordCount.vue';
import CheckDuplicate from './components/CheckDuplicate.vue';
import ImageViewer from './components/ImageViewer.vue';
import FileViewer from './components/FileViewer.vue';
import ImportData from './components/ImportData.vue';
import LangSwitcher from './components/LangSwitcher.vue';
import InfiniteScroll from './components/InfiniteScroll.vue';
import FilterTags from './components/FilterTags.vue';

import EventBus from "./AppEventBus"
import { utils } from './utils';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import { AppMenus } from './menus';


import { useAuth } from 'src/composables/auth';

import { i18n } from './services/i18n'

(async () => {
    const pinia = createPinia();
    const app = createApp(App);

    app.use(pinia);
    app.use(PrimeVue, { ripple: true, locale: i18n.messages});
    app.use(ConfirmationService);
    app.use(ToastService);

    //make appname available in any component
    app.config.globalProperties.$appName = process.env.VUE_APP_NAME;

    //app api base url e.g http://localhost:8060/
    const apiUrl = process.env.VUE_APP_API_URL;
    
    //app api path. e.g http://localhost:8060/api/
    const apiPath = process.env.VUE_APP_API_PATH ;

    app.config.globalProperties.$apiUrl = apiUrl;
    app.config.globalProperties.$apiPath = apiPath;
    // Global event bus
    app.config.globalProperties.$EventBus = EventBus;
    //axio api service use for making api request
    
    ApiService.init();
    app.config.globalProperties.$api = ApiService;
    
    //save data to localstorage
    app.config.globalProperties.$localStore = StorageService;
    //all application menu
    app.config.globalProperties.$menus = AppMenus;
    app.config.globalProperties.$utils = utils;

    app.config.globalProperties.$i18n = i18n;
	app.config.globalProperties.$t = i18n.t;


    
    const auth = useAuth();
	app.config.globalProperties.$auth = auth;
	await auth.getUserData();  // get logged in user data


    const router = Router();
    app.use(router);
  
    //primevue components
    app.directive('tooltip', Tooltip);
    app.directive('ripple', Ripple);
    app.directive('badge', BadgeDirective);
    app.directive('styleclass', StyleClass);
    app.component('Accordion', Accordion);
    app.component('AccordionTab', AccordionTab);
    app.component('AutoComplete', AutoComplete);
    app.component('Avatar', Avatar);
    app.component('Badge', Badge);
    app.component('Breadcrumb', Breadcrumb);
    app.component('Button', Button);
    app.component('Chart', Chart);
    app.component('Card', Card);
    app.component('Carousel', Carousel);
    app.component('Calendar', Calendar);
    app.component('Checkbox', Checkbox);
    app.component('Chip', Chip);
    app.component('Chips', Chips);
    app.component('Column', Column);
    app.component('ConfirmDialog', ConfirmDialog);
    app.component('ConfirmPopup', ConfirmPopup);
    app.component('DataTable', DataTable);
    app.component('DataView', DataView);
    app.component('Dialog', Dialog);
    app.component('Divider', Divider);
    app.component('Listbox', Listbox);
    app.component('Dropdown', Dropdown);
    app.component('Fieldset', Fieldset);
    app.component('FileUpload', FileUpload);
    app.component('Image', Image);
    app.component('InlineMessage', InlineMessage);
    app.component('Inplace', Inplace);
    app.component('InputMask', InputMask);
    app.component('InputNumber', InputNumber);
    app.component('InputSwitch', InputSwitch);
    app.component('InputText', InputText);
    app.component('Knob', Knob);
    app.component('Menu', Menu);
    app.component('Menubar', Menubar);
    app.component('Message', Message);
    app.component('MultiSelect', MultiSelect);
    app.component('OverlayPanel', OverlayPanel);
    app.component('Paginator', Paginator);
    app.component('Password', Password);
    app.component('ProgressBar', ProgressBar);
    app.component('RadioButton', RadioButton);
    app.component('Rating', Rating);
    app.component('SelectButton', SelectButton);
    app.component('ScrollPanel', ScrollPanel);
    app.component('Panel', Panel);
    app.component('BlockUI', BlockUI);
    app.component('ScrollTop', ScrollTop);
    app.component('Slider', Slider);
    app.component('Sidebar', Sidebar);
    app.component('Skeleton', Skeleton);
    app.component('SplitButton', SplitButton);
    app.component('TabMenu', TabMenu);
    app.component('TabView', TabView);
    app.component('TabPanel', TabPanel);
    app.component('Tag', Tag);
    app.component('Textarea', Textarea);
    app.component('Editor', Editor);
    app.component('Toast', Toast);
    app.component('Toolbar', Toolbar);
    app.component('ToggleButton', ToggleButton);
    app.component('ProgressSpinner', ProgressSpinner);
    
    //radsystems custom components
    app.component('NiceImage', NiceImage);
    app.component('AutoCompleteSelect', AutoCompleteSelect);
    app.component('PageSearch', PageSearch);
    app.component('ApiDataSource', ApiDataSource);
    app.component('Uploader', Uploader);
    app.component('RecordCount', RecordCount);
    app.component('CheckDuplicate', CheckDuplicate);
    app.component('ImageViewer', ImageViewer);
    app.component('FileViewer', FileViewer);
    app.component('ImportData', ImportData);
    app.component('LangSwitcher', LangSwitcher);
    app.component('InfiniteScroll', InfiniteScroll);
    app.component('FilterTags', FilterTags);

    app.mount('#app');

})();