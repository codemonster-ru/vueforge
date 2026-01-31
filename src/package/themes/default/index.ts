import base from './base';
import button from './components/button';
import card from './components/card';
import codeBlock from './components/codeBlock';
import container from './components/container';
import content from './components/content';
import demo from './components/demo';
import footer from './components/footer';
import header from './components/header';
import input from './components/input';
import link from './components/link';
import logo from './components/logo';
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
        container,
        content,
        demo,
        footer,
        header,
        input,
        link,
        logo,
        menu,
        popover,
        select,
        checkbox,
        switch: switchComponent,
    },
};
