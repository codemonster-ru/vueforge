import base from './base';
import button from './components/button';
import card from './components/card';
import codeBlock from './components/codeBlock';
import input from './components/input';
import link from './components/link';
import menu from './components/menu';
import popover from './components/popover';
import select from './components/select';
import checkbox from './components/checkbox';
import switchComponent from './components/switch';

export default {
    ...base,
    components: {
        base,
        button,
        card,
        codeBlock,
        input,
        link,
        menu,
        popover,
        select,
        checkbox,
        switch: switchComponent,
    },
};
