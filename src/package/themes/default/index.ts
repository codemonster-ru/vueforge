import base from './base';
import button from './components/button';
import card from './components/card';
import input from './components/input';
import numberInput from './components/number-input';
import formField from './components/form-field';
import textarea from './components/textarea';
import fileUpload from './components/file-upload';
import link from './components/link';
import breadcrumbs from './components/breadcrumbs';
import menu from './components/menu';
import modal from './components/modal';
import drawer from './components/drawer';
import popover from './components/popover';
import dropdown from './components/dropdown';
import select from './components/select';
import autocomplete from './components/autocomplete';
import multiselect from './components/multiselect';
import datepicker from './components/datepicker';
import daterangepicker from './components/daterangepicker';
import timepicker from './components/timepicker';
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
import badge from './components/badge';
import chip from './components/chip';
import avatar from './components/avatar';
import slider from './components/slider';
import stepper from './components/stepper';

export default {
    ...base,
    components: {
        base,
        button,
        card,
        input,
        numberInput,
        formField,
        textarea,
        fileUpload,
        link,
        breadcrumbs,
        menu,
        modal,
        drawer,
        popover,
        dropdown,
        select,
        autocomplete,
        multiselect,
        datepicker,
        daterangepicker,
        timepicker,
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
        badge,
        chip,
        avatar,
        slider,
        stepper,
    },
};
