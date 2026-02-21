# Date/Time Locale Setup

VueForge date/time components support both:

- global defaults (runtime/plugin config)
- per-component overrides (`locale`, `firstDayOfWeek`)

Components covered by global defaults:

- `Calendar`
- `DatePicker`
- `DateRangePicker`
- `DateTimePicker`

## Global Setup via Plugin

```ts
import { createApp } from 'vue';
import { VueForge, DefaultTheme } from '@codemonster-ru/vueforge';

const app = createApp(App);

app.use(VueForge, {
    theme: { preset: DefaultTheme },
    dateTimeLocale: {
        locale: 'fr-FR',
        firstDayOfWeek: 1,
    },
});
```

## Runtime Update API

```ts
import { getDateTimeLocale, setDateTimeLocale, updateDateTimeLocale } from '@codemonster-ru/vueforge';

setDateTimeLocale({ locale: 'de-DE', firstDayOfWeek: 1 });
updateDateTimeLocale({ locale: 'en-GB' });
const current = getDateTimeLocale();
```

## Precedence Rules

- Local component props have priority over global defaults.
- If a component omits `locale`/`firstDayOfWeek`, global config is used.
- `firstDayOfWeek` is normalized to the `0..6` range (`0` = Sunday).
