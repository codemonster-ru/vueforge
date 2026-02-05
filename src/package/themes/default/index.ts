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
import accordion from './components/accordion';
import tooltip from './components/tooltip';
import skeleton from './components/skeleton';
import datatable from './components/datatable';
import toast from './components/toast';
import alert from './components/alert';
import progress from './components/progress';

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
        accordion,
        tooltip,
        skeleton,
        datatable,
        toast,
        alert,
        progress,
    },
};
