import base from '../base';
import button from '../components/button';
import buttonGroup from '../components/button-group';
import card from '../components/card';
import panel from '../components/panel';
import sheet from '../components/sheet';
import fieldset from '../components/fieldset';
import toolbar from '../components/toolbar';
import container from '../components/container';
import grid from '../components/grid';
import section from '../components/section';
import stack from '../components/stack';
import inlineComponent from '../components/inline';
import input from '../components/input';
import inputGroup from '../components/input-group';
import iconField from '../components/icon-field';
import inputIcon from '../components/input-icon';
import inlineEdit from '../components/inline-edit';
import inplace from '../components/inplace';
import image from '../components/image';
import icon from '../components/icon';
import passwordInput from '../components/password-input';
import otpInput from '../components/otp-input';
import colorPicker from '../components/color-picker';
import maskedInput from '../components/masked-input';
import numberInput from '../components/number-input';
import form from '../components/form';
import formField from '../components/form-field';
import floatLabel from '../components/float-label';
import iftaLabel from '../components/ifta-label';
import textarea from '../components/textarea';
import link from '../components/link';
import divider from '../components/divider';
import dock from '../components/dock';
import galleria from '../components/galleria';
import knob from '../components/knob';
import menu from '../components/menu';
import menubar from '../components/menubar';
import megamenu from '../components/megamenu';
import panelmenu from '../components/panelmenu';
import modal from '../components/modal';
import confirmDialog from '../components/confirm-dialog';
import confirmPopup from '../components/confirm-popup';
import drawer from '../components/drawer';
import popover from '../components/popover';
import dropdown from '../components/dropdown';
import splitbutton from '../components/splitbutton';
import contextMenu from '../components/context-menu';
import blockui from '../components/block-ui';
import select from '../components/select';
import autocomplete from '../components/autocomplete';
import combobox from '../components/combobox';
import multiselect from '../components/multiselect';
import listbox from '../components/listbox';
import picklist from '../components/picklist';
import orderlist from '../components/orderlist';
import taginput from '../components/taginput';
import cascadeSelect from '../components/treeselect';
import datepicker from '../components/datepicker';
import daterangepicker from '../components/daterangepicker';
import timepicker from '../components/timepicker';
import datetimepicker from '../components/datetimepicker';
import calendar from '../components/calendar';
import pagination from '../components/pagination';
import checkbox from '../components/checkbox';
import radio from '../components/radio';
import switchComponent from '../components/switch';
import selectionControl from '../components/selection-control';
import selectionControlGroup from '../components/selection-control-group';
import segmentedControl from '../components/segmented-control';
import themeModeSwitch from '../components/theme-mode-switch';
import toggleButton from '../components/toggle-button';
import hover from '../components/hover';
import kbd from '../components/kbd';
import lazy from '../components/lazy';
import parallax from '../components/parallax';
import tabs from '../components/tabs';
import tabMenu from '../components/tab-menu';
import window from '../components/window';
import slideGroup from '../components/slide-group';
import accordion from '../components/accordion';
import tooltip from '../components/tooltip';
import skeleton from '../components/skeleton';
import datatable from '../components/datatable';
import dataview from '../components/dataview';
import carousel from '../components/carousel';
import speeddial from '../components/speeddial';
import toast from '../components/toast';
import snackbarQueue from '../components/snackbar-queue';
import alert from '../components/alert';
import emptyState from '../components/empty-state';
import progress from '../components/progress';
import badge from '../components/badge';
import chip from '../components/chip';
import avatar from '../components/avatar';
import avatarGroup from '../components/avatar-group';
import spinner from '../components/spinner';
import scrollpanel from '../components/scrollpanel';
import scrolltop from '../components/scrolltop';
import slider from '../components/slider';
import splitter from '../components/splitter';
import stepper from '../components/stepper';
import timeline from '../components/timeline';
import commentThread from '../components/comment-thread';
import meterGroup from '../components/meter-group';
import inlineMessage from '../components/inline-message';
import overlayBadge from '../components/overlay-badge';
import jsonViewer from '../components/json-viewer';
import diffViewer from '../components/diff-viewer';
import codeBlock from '../components/code-block';
import infiniteScroll from '../components/infinite-scroll';
import rating from '../components/rating';
import tree from '../components/tree';
import orgchart from '../components/orgchart';
import treeselect from '../components/treeselect';
import treetable from '../components/treetable';
import virtualScroller from '../components/virtual-scroller';

const components = {
    base,
    button,
    buttonGroup,
    card,
    panel,
    sheet,
    fieldset,
    toolbar,
    container,
    grid,
    section,
    stack,
    inline: inlineComponent,
    input,
    inputGroup,
    iconField,
    inputIcon,
    inlineEdit,
    inplace,
    image,
    icon,
    passwordInput,
    otpInput,
    colorPicker,
    maskedInput,
    numberInput,
    form,
    formField,
    floatLabel,
    iftaLabel,
    textarea,
    link,
    divider,
    dock,
    galleria,
    knob,
    menu,
    tieredMenu: menu,
    menubar,
    megamenu,
    panelmenu,
    modal,
    dynamicDialog: modal,
    confirmDialog,
    confirmPopup,
    drawer,
    sidebar: drawer,
    popover,
    overlaypanel: popover,
    dropdown,
    splitbutton,
    contextMenu,
    blockui,
    select,
    autocomplete,
    combobox,
    multiselect,
    listbox,
    picklist,
    orderlist,
    taginput,
    cascadeSelect,
    datepicker,
    daterangepicker,
    timepicker,
    datetimepicker,
    calendar,
    pagination,
    checkbox,
    radio,
    switch: switchComponent,
    selectionControl,
    selectionControlGroup,
    segmentedControl,
    themeModeSwitch,
    toggleButton,
    hover,
    kbd,
    lazy,
    parallax,
    tabs,
    tabMenu,
    window,
    slideGroup,
    accordion,
    tooltip,
    skeleton,
    datatable,
    dataview,
    carousel,
    speeddial,
    toast,
    snackbarQueue,
    alert,
    message: alert,
    emptyState,
    progress,
    badge,
    chip,
    avatar,
    avatarGroup,
    spinner,
    scrollpanel,
    scrolltop,
    slider,
    splitter,
    stepper,
    timeline,
    commentThread,
    meterGroup,
    inlineMessage,
    overlayBadge,
    jsonViewer,
    diffViewer,
    codeBlock,
    infiniteScroll,
    rating,
    tree,
    orgchart,
    treeselect,
    treetable,
    virtualScroller,
};

export default {
    ...base,
    components,
};
