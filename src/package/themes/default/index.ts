import base from './base';
import button from './components/button';
import card from './components/card';
import input from './components/input';
import passwordInput from './components/password-input';
import otpInput from './components/otp-input';
import colorPicker from './components/color-picker';
import maskedInput from './components/masked-input';
import numberInput from './components/number-input';
import formField from './components/form-field';
import textarea from './components/textarea';
import fileUpload from './components/file-upload';
import link from './components/link';
import breadcrumbs from './components/breadcrumbs';
import menu from './components/menu';
import modal from './components/modal';
import confirmDialog from './components/confirm-dialog';
import drawer from './components/drawer';
import popover from './components/popover';
import dropdown from './components/dropdown';
import splitbutton from './components/splitbutton';
import contextMenu from './components/context-menu';
import commandPalette from './components/command-palette';
import select from './components/select';
import autocomplete from './components/autocomplete';
import multiselect from './components/multiselect';
import taginput from './components/taginput';
import datepicker from './components/datepicker';
import daterangepicker from './components/daterangepicker';
import timepicker from './components/timepicker';
import datetimepicker from './components/datetimepicker';
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
import rating from './components/rating';
import tree from './components/tree';
import treeselect from './components/treeselect';
import virtualScroller from './components/virtual-scroller';

export default {
    ...base,
    components: {
        base,
        button,
        card,
        input,
        passwordInput,
        otpInput,
        colorPicker,
        maskedInput,
        numberInput,
        formField,
        textarea,
        fileUpload,
        link,
        breadcrumbs,
        menu,
        modal,
        confirmDialog,
        drawer,
        popover,
        dropdown,
        splitbutton,
        contextMenu,
        commandPalette,
        select,
        autocomplete,
        multiselect,
        taginput,
        datepicker,
        daterangepicker,
        timepicker,
        datetimepicker,
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
        rating,
        tree,
        treeselect,
        virtualScroller,
    },
};
