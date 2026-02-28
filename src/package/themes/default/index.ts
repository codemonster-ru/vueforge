import base from './base';
import button from './components/button';
import buttonGroup from './components/button-group';
import card from './components/card';
import panel from './components/panel';
import sheet from './components/sheet';
import fieldset from './components/fieldset';
import toolbar from './components/toolbar';
import chart from './components/chart';
import container from './components/container';
import grid from './components/grid';
import section from './components/section';
import stack from './components/stack';
import inlineComponent from './components/inline';
import input from './components/input';
import inputGroup from './components/input-group';
import iconField from './components/icon-field';
import inputIcon from './components/input-icon';
import inlineEdit from './components/inline-edit';
import inplace from './components/inplace';
import image from './components/image';
import icon from './components/icon';
import searchInput from './components/search-input';
import mentionInput from './components/mention-input';
import passwordInput from './components/password-input';
import otpInput from './components/otp-input';
import colorPicker from './components/color-picker';
import maskedInput from './components/masked-input';
import numberInput from './components/number-input';
import form from './components/form';
import formField from './components/form-field';
import floatLabel from './components/float-label';
import iftaLabel from './components/ifta-label';
import textarea from './components/textarea';
import richTextEditor from './components/rich-text-editor';
import fileUpload from './components/file-upload';
import link from './components/link';
import breadcrumbs from './components/breadcrumbs';
import divider from './components/divider';
import dock from './components/dock';
import galleria from './components/galleria';
import knob from './components/knob';
import terminal from './components/terminal';
import pageHeader from './components/page-header';
import menu from './components/menu';
import menubar from './components/menubar';
import megamenu from './components/megamenu';
import panelmenu from './components/panelmenu';
import modal from './components/modal';
import confirmDialog from './components/confirm-dialog';
import confirmPopup from './components/confirm-popup';
import drawer from './components/drawer';
import popover from './components/popover';
import dropdown from './components/dropdown';
import splitbutton from './components/splitbutton';
import contextMenu from './components/context-menu';
import commandPalette from './components/command-palette';
import notificationCenter from './components/notification-center';
import appShell from './components/app-shell';
import appBar from './components/app-bar';
import navigationRail from './components/navigation-rail';
import bottomNavigation from './components/bottom-navigation';
import systemBar from './components/system-bar';
import footer from './components/footer';
import pageLayout from './components/page-layout';
import mainLayoutRegion from './components/main-layout-region';
import splitLayout from './components/split-layout';
import resizableSidebar from './components/resizable-sidebar';
import stickyRegion from './components/sticky-region';
import blockui from './components/block-ui';
import kanbanBoard from './components/kanban-board';
import select from './components/select';
import autocomplete from './components/autocomplete';
import combobox from './components/combobox';
import multiselect from './components/multiselect';
import listbox from './components/listbox';
import picklist from './components/picklist';
import orderlist from './components/orderlist';
import taginput from './components/taginput';
import cascadeSelect from './components/treeselect';
import datepicker from './components/datepicker';
import daterangepicker from './components/daterangepicker';
import timepicker from './components/timepicker';
import datetimepicker from './components/datetimepicker';
import calendar from './components/calendar';
import pagination from './components/pagination';
import checkbox from './components/checkbox';
import radio from './components/radio';
import switchComponent from './components/switch';
import selectionControl from './components/selection-control';
import selectionControlGroup from './components/selection-control-group';
import segmentedControl from './components/segmented-control';
import themeModeSwitch from './components/theme-mode-switch';
import toggleButton from './components/toggle-button';
import hover from './components/hover';
import kbd from './components/kbd';
import lazy from './components/lazy';
import parallax from './components/parallax';
import tabs from './components/tabs';
import tabMenu from './components/tab-menu';
import window from './components/window';
import slideGroup from './components/slide-group';
import accordion from './components/accordion';
import tooltip from './components/tooltip';
import tour from './components/tour';
import skeleton from './components/skeleton';
import datatable from './components/datatable';
import dataview from './components/dataview';
import carousel from './components/carousel';
import speeddial from './components/speeddial';
import toast from './components/toast';
import snackbarQueue from './components/snackbar-queue';
import banner from './components/banner';
import alert from './components/alert';
import emptyState from './components/empty-state';
import progress from './components/progress';
import badge from './components/badge';
import chip from './components/chip';
import filterChips from './components/filter-chips';
import advancedFilterPanel from './components/advanced-filter-panel';
import queryBuilder from './components/query-builder';
import savedViewsManager from './components/saved-views-manager';
import dataTableToolbar from './components/data-table-toolbar';
import bulkActionBar from './components/bulk-action-bar';
import avatar from './components/avatar';
import avatarGroup from './components/avatar-group';
import spinner from './components/spinner';
import scrollpanel from './components/scrollpanel';
import scrolltop from './components/scrolltop';
import slider from './components/slider';
import splitter from './components/splitter';
import stepper from './components/stepper';
import wizard from './components/wizard';
import timeline from './components/timeline';
import activityFeed from './components/activity-feed';
import auditLogViewer from './components/audit-log-viewer';
import commentThread from './components/comment-thread';
import memberPicker from './components/member-picker';
import permissionMatrix from './components/permission-matrix';
import kpiStatCard from './components/kpi-stat-card';
import meterGroup from './components/meter-group';
import inlineMessage from './components/inline-message';
import overlayBadge from './components/overlay-badge';
import fileManager from './components/file-manager';
import jsonViewer from './components/json-viewer';
import diffViewer from './components/diff-viewer';
import codeEditor from './components/code-editor';
import codeBlock from './components/code-block';
import scheduler from './components/scheduler';
import bottomSheet from './components/bottom-sheet';
import infiniteScroll from './components/infinite-scroll';
import rating from './components/rating';
import tree from './components/tree';
import orgchart from './components/orgchart';
import treeselect from './components/treeselect';
import treetable from './components/treetable';
import virtualScroller from './components/virtual-scroller';

export default {
    ...base,
    components: {
        base,
        button,
        buttonGroup,
        card,
        panel,
        sheet,
        fieldset,
        toolbar,
        chart,
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
        searchInput,
        mentionInput,
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
        richTextEditor,
        fileUpload,
        link,
        breadcrumbs,
        divider,
        dock,
        galleria,
        knob,
        terminal,
        pageHeader,
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
        commandPalette,
        notificationCenter,
        appShell,
        appBar,
        navigationRail,
        bottomNavigation,
        systemBar,
        footer,
        pageLayout,
        mainLayoutRegion,
        splitLayout,
        resizableSidebar,
        stickyRegion,
        blockui,
        kanbanBoard,
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
        tour,
        skeleton,
        datatable,
        dataview,
        carousel,
        speeddial,
        toast,
        snackbarQueue,
        banner,
        alert,
        message: alert,
        emptyState,
        progress,
        badge,
        chip,
        filterChips,
        advancedFilterPanel,
        queryBuilder,
        savedViewsManager,
        dataTableToolbar,
        bulkActionBar,
        avatar,
        avatarGroup,
        spinner,
        scrollpanel,
        scrolltop,
        slider,
        splitter,
        stepper,
        wizard,
        timeline,
        activityFeed,
        auditLogViewer,
        commentThread,
        memberPicker,
        permissionMatrix,
        kpiStatCard,
        meterGroup,
        inlineMessage,
        overlayBadge,
        fileManager,
        jsonViewer,
        diffViewer,
        codeEditor,
        codeBlock,
        scheduler,
        bottomSheet,
        infiniteScroll,
        rating,
        tree,
        orgchart,
        treeselect,
        treetable,
        virtualScroller,
    },
};
