import base from './base';
import button from './components/button';
import card from './components/card';
import input from './components/input';
import textarea from './components/textarea';
import link from './components/link';
import menu from './components/menu';
import modal from './components/modal';
import popover from './components/popover';
import select from './components/select';
import checkbox from './components/checkbox';
import radio from './components/radio';
import switchComponent from './components/switch';
import tabs from './components/tabs';
import tooltip from './components/tooltip';
import toast from './components/toast';

export default {
    ...base,
    components: {
        base,
        button,
        card,
        input,
        textarea,
        link,
        menu,
        modal,
        popover,
        select,
        checkbox,
        radio,
        switch: switchComponent,
        tabs,
        tooltip,
        toast,
    },
};
