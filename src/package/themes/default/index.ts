import base from './base';
import button from './components/button';
import card from './components/card';
import input from './components/input';
import formField from './components/form-field';
import textarea from './components/textarea';
import link from './components/link';
import menu from './components/menu';
import modal from './components/modal';
import popover from './components/popover';
import select from './components/select';
import autocomplete from './components/autocomplete';
import multiselect from './components/multiselect';
import datepicker from './components/datepicker';
import pagination from './components/pagination';
import checkbox from './components/checkbox';
import radio from './components/radio';
import switchComponent from './components/switch';
import tabs from './components/tabs';
import tooltip from './components/tooltip';
import skeleton from './components/skeleton';
import toast from './components/toast';
import alert from './components/alert';

export default {
    ...base,
    components: {
        base,
        button,
        card,
        input,
        formField,
        textarea,
        link,
        menu,
        modal,
        popover,
        select,
        autocomplete,
        multiselect,
        datepicker,
        pagination,
        checkbox,
        radio,
        switch: switchComponent,
        tabs,
        tooltip,
        skeleton,
        toast,
        alert,
    },
};
