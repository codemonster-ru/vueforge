export const escapeCodeHtml = (value: string): string =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const unescapeCodeHtml = (value: string): string =>
    value
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&');

const renderPlain = (line: string) => escapeCodeHtml(line);

const wrapToken = (tokenClass: string, value: string) =>
    `<span class="vf-code-block__token ${tokenClass}">${value}</span>`;

const jsNumberPattern = '\\b\\d(?:[\\d_]*\\d)?(?:\\.\\d(?:[\\d_]*\\d)?)?\\b';
const cssNumberPattern = '\\b-?\\d(?:[\\d_]*\\d)?(?:\\.\\d(?:[\\d_]*\\d)?)?(?:px|rem|em|%|vh|vw|fr|s|ms|deg)?\\b';

const isVueDirectiveAttribute = (attributeName: string) =>
    attributeName.startsWith(':') ||
    attributeName.startsWith('@') ||
    attributeName.startsWith('#') ||
    attributeName.startsWith('v-');

const isComponentTagName = (tagName: string) => /^[A-Z]/.test(tagName);

const highlightTemplateLiteral = (value: string): string => {
    let cursor = 0;
    let html = wrapToken('vf-code-block__token_string', escapeCodeHtml('`'));

    while (cursor < value.length - 1) {
        const interpolationStart = value.indexOf('${', cursor);
        const segmentEnd = interpolationStart === -1 ? value.length - 1 : interpolationStart;
        const segment = value.slice(cursor, segmentEnd);

        if (segment) {
            html += wrapToken('vf-code-block__token_string', escapeCodeHtml(segment));
        }

        if (interpolationStart === -1) {
            break;
        }

        html += escapeCodeHtml('${');
        let expressionCursor = interpolationStart + 2;
        let depth = 1;

        while (expressionCursor < value.length && depth > 0) {
            const character = value[expressionCursor];
            if (character === '{') {
                depth += 1;
            } else if (character === '}') {
                depth -= 1;
            }

            expressionCursor += 1;
        }

        const expression = value.slice(interpolationStart + 2, expressionCursor - 1);
        html += highlightJsExpression(expression);
        html += escapeCodeHtml('}');
        cursor = expressionCursor;
    }

    html += wrapToken('vf-code-block__token_string', escapeCodeHtml('`'));
    return html;
};

const highlightJsExpression = (value: string) => highlightJsLike(value);

const highlightDirectiveExpressionValue = (attributeValue: string) => {
    if (attributeValue.length < 2) {
        return wrapToken('vf-code-block__token_string', attributeValue);
    }

    const quote = attributeValue[0];
    const innerValue = unescapeCodeHtml(attributeValue.slice(1, -1));
    const highlightedInner = highlightJsExpression(innerValue);
    const escapedQuote = quote === '"' ? '&quot;' : '&#39;';

    return `${escapedQuote}${highlightedInner}${escapedQuote}`;
};

const highlightMultilineAttributeSegment = (
    value: string,
    quote: '"' | "'",
    directive: boolean,
    includeOpeningQuote: boolean,
    includeClosingQuote: boolean,
) => {
    const highlightedInner = directive
        ? highlightJsExpression(unescapeCodeHtml(value))
        : wrapToken('vf-code-block__token_string', escapeCodeHtml(value));
    const escapedQuote = quote === '"' ? '&quot;' : '&#39;';

    return `${includeOpeningQuote ? escapedQuote : ''}${highlightedInner}${includeClosingQuote ? escapedQuote : ''}`;
};

const highlightInterpolations = (value: string) =>
    value.replaceAll(/{{\s*([\s\S]*?)\s*}}/g, (_match, expression: string) => {
        const highlightedExpression = highlightJsExpression(expression);
        return `${escapeCodeHtml('{{ ')}${highlightedExpression}${escapeCodeHtml(' }}')}`;
    });

const highlightMarkupAttributes = (value: string) =>
    value.replaceAll(
        /(\s+)([:@#]?[\w-]+(?::[\w-]+)?)(\s*=\s*)?("[^"]*"|'[^']*')?/g,
        (_attrMatch, whitespace, attributeName, equals = '', attributeValue = '') =>
            `${escapeCodeHtml(whitespace)}${wrapToken(
                isVueDirectiveAttribute(attributeName)
                    ? 'vf-code-block__token_directive'
                    : 'vf-code-block__token_attribute',
                escapeCodeHtml(attributeName),
            )}${escapeCodeHtml(equals)}${
                attributeValue
                    ? isVueDirectiveAttribute(attributeName)
                        ? highlightDirectiveExpressionValue(attributeValue)
                        : wrapToken('vf-code-block__token_string', escapeCodeHtml(attributeValue))
                    : ''
            }`,
    );

const highlightMarkupOpeningStart = (line: string) => {
    const openingMatch = line.match(/^(\s*)<([/\w-]+)([\s\S]*)$/);
    if (!openingMatch) {
        return escapeCodeHtml(line);
    }

    const [, indentation, rawTagName, attributes] = openingMatch;
    const closing = rawTagName.startsWith('/');
    const tagName = closing ? rawTagName.slice(1) : rawTagName;
    const tagTokenClass = isComponentTagName(tagName) ? 'vf-code-block__token_component' : 'vf-code-block__token_tag';

    return `${escapeCodeHtml(indentation)}${escapeCodeHtml(closing ? '</' : '<')}${wrapToken(
        tagTokenClass,
        escapeCodeHtml(tagName),
    )}${highlightMarkupAttributes(String(attributes))}`;
};

const highlightMarkupTag = (rawTag: string) => {
    if (rawTag.startsWith('<!--') && rawTag.endsWith('-->')) {
        return wrapToken('vf-code-block__token_comment', escapeCodeHtml(rawTag));
    }

    const closing = rawTag.startsWith('</');
    const selfClosing = rawTag.endsWith('/>');
    const inner = rawTag.slice(closing ? 2 : 1, rawTag.length - (selfClosing ? 2 : 1));
    const tagMatch = inner.match(/^([\w-]+)([\s\S]*)$/);

    if (!tagMatch) {
        return escapeCodeHtml(rawTag);
    }

    const [, tagName, attributes] = tagMatch;
    const tagTokenClass = isComponentTagName(tagName) ? 'vf-code-block__token_component' : 'vf-code-block__token_tag';

    return `${escapeCodeHtml(closing ? '</' : '<')}${wrapToken(
        tagTokenClass,
        escapeCodeHtml(tagName),
    )}${highlightMarkupAttributes(attributes)}${escapeCodeHtml(selfClosing ? '/>' : '>')}`;
};

const highlightJson = (line: string) => {
    const escaped = escapeCodeHtml(line);

    return escaped
        .replaceAll(/"(?:[^"\\]|\\.)*"(?=\s*:)?/g, match => wrapToken('vf-code-block__token_string', match))
        .replaceAll(/\b(true|false|null)\b/g, match => wrapToken('vf-code-block__token_keyword', match))
        .replaceAll(/\b-?\d(?:[\d_]*\d)?(?:\.\d(?:[\d_]*\d)?)?(?:[eE][+-]?\d(?:[\d_]*\d)?)?\b/g, match =>
            wrapToken('vf-code-block__token_number', match),
        );
};

const readPreviousNonWhitespace = (value: string, startIndex: number): string => {
    for (let index = startIndex - 1; index >= 0; index -= 1) {
        const character = value[index];
        if (!/\s/.test(character)) {
            return character;
        }
    }

    return '';
};

const readNextNonWhitespace = (value: string, endIndex: number): string => {
    for (let index = endIndex; index < value.length; index += 1) {
        const character = value[index];
        if (!/\s/.test(character)) {
            return character;
        }
    }

    return '';
};

const readPreviousWord = (value: string, startIndex: number): string => {
    let cursor = startIndex;

    while (cursor > 0 && /\s/.test(value[cursor - 1])) {
        cursor -= 1;
    }

    const match = value.slice(0, cursor).match(/([A-Za-z_$][\w$]*)\s*$/);
    return match?.[1] ?? '';
};

const classifyJsIdentifier = (line: string, identifier: string, index: number): string => {
    const previousCharacter = readPreviousNonWhitespace(line, index);
    const nextCharacter = readNextNonWhitespace(line, index + identifier.length);
    const previousWord = readPreviousWord(line, index);
    const previousSlice = line.slice(0, index);

    if (previousCharacter === '.' || /\?\.\s*$/.test(previousSlice)) {
        return 'vf-code-block__token_property';
    }

    if (nextCharacter === ':' && ['{', ',', ''].includes(previousCharacter)) {
        return 'vf-code-block__token_property';
    }

    if (nextCharacter === '(') {
        return 'vf-code-block__token_function';
    }

    if (/^[A-Z]/.test(identifier) || ['import', 'from', 'new', 'class', 'extends'].includes(previousWord)) {
        return 'vf-code-block__token_identifier';
    }

    return 'vf-code-block__token_variable';
};

const highlightJsLike = (line: string) => {
    const tokenPattern = new RegExp(
        `(//.*$)|((["'\`])(?:\\\\.|(?!\\3).)*\\3)|\\b(const|let|var|function|return|if|else|for|while|class|new|import|export|from|await|async|try|catch|throw|true|false|null|undefined)\\b|(=>|\\?\\?|\\?|:|\\.|[{}()[\\],])|${jsNumberPattern}|\\b[A-Za-z_$][\\w$]*\\b`,
        'g',
    );
    let cursor = 0;
    let html = '';

    for (const match of line.matchAll(tokenPattern)) {
        const fullMatch = match[0] ?? '';
        const index = match.index ?? 0;

        html += escapeCodeHtml(line.slice(cursor, index));

        if (match[1]) {
            html += wrapToken('vf-code-block__token_comment', escapeCodeHtml(fullMatch));
        } else if (match[2]) {
            html +=
                fullMatch.startsWith('`') && fullMatch.includes('${')
                    ? highlightTemplateLiteral(fullMatch)
                    : wrapToken('vf-code-block__token_string', escapeCodeHtml(fullMatch));
        } else if (match[4]) {
            html += wrapToken('vf-code-block__token_keyword', escapeCodeHtml(fullMatch));
        } else if (match[5]) {
            html += wrapToken('vf-code-block__token_operator', escapeCodeHtml(fullMatch));
        } else if (/^\d/.test(fullMatch)) {
            html += wrapToken('vf-code-block__token_number', escapeCodeHtml(fullMatch));
        } else {
            html += wrapToken(classifyJsIdentifier(line, fullMatch, index), escapeCodeHtml(fullMatch));
        }

        cursor = index + fullMatch.length;
    }

    html += escapeCodeHtml(line.slice(cursor));
    return html;
};

const findMarkupTagEnd = (line: string, startIndex: number) => {
    let quote: '"' | "'" | null = null;

    for (let index = startIndex + 1; index < line.length; index += 1) {
        const character = line[index];

        if (quote) {
            if (character === quote && line[index - 1] !== '\\') {
                quote = null;
            }
            continue;
        }

        if (character === '"' || character === "'") {
            quote = character as '"' | "'";
            continue;
        }

        if (character === '>') {
            return index;
        }
    }

    return -1;
};

const highlightMarkupLike = (line: string) => {
    if (!line.trim()) {
        return escapeCodeHtml(line);
    }

    let cursor = 0;
    let html = '';

    while (cursor < line.length) {
        const tagStart = line.indexOf('<', cursor);

        if (tagStart === -1) {
            html += highlightInterpolations(escapeCodeHtml(line.slice(cursor)));
            break;
        }

        html += highlightInterpolations(escapeCodeHtml(line.slice(cursor, tagStart)));
        const tagEnd = findMarkupTagEnd(line, tagStart);

        if (tagEnd === -1) {
            html += escapeCodeHtml(line.slice(tagStart));
            break;
        }

        html += highlightMarkupTag(line.slice(tagStart, tagEnd + 1));
        cursor = tagEnd + 1;
    }

    return html;
};

const highlightBash = (line: string) => {
    const npmRunMatch = line.match(/^(\s*)(npm)(\s+)(run)(\s+)([^\s].*)$/);
    if (npmRunMatch) {
        const [, indentation, command, spaceAfterCommand, subcommand, spaceAfterSubcommand, scriptName] = npmRunMatch;
        return `${escapeCodeHtml(indentation)}${wrapToken(
            'vf-code-block__token_keyword',
            escapeCodeHtml(command),
        )}${escapeCodeHtml(spaceAfterCommand)}${wrapToken(
            'vf-code-block__token_function',
            escapeCodeHtml(subcommand),
        )}${escapeCodeHtml(spaceAfterSubcommand)}${wrapToken(
            'vf-code-block__token_variable',
            escapeCodeHtml(scriptName),
        )}`;
    }

    const tokenPattern =
        /(#[^\n]*$)|((["'])(?:\\.|(?!\3).)*\3)|(\$[A-Za-z_][A-Za-z0-9_]*)|(@[A-Za-z0-9._/-]+)|(^\s*[A-Za-z][\w-]*\b)|(\s-[A-Za-z-]+\b|\s--[A-Za-z-]+\b)/g;
    let cursor = 0;
    let html = '';

    for (const match of line.matchAll(tokenPattern)) {
        const fullMatch = match[0] ?? '';
        const index = match.index ?? 0;

        html += escapeCodeHtml(line.slice(cursor, index));

        if (match[1]) {
            html += wrapToken('vf-code-block__token_comment', escapeCodeHtml(fullMatch));
        } else if (match[2]) {
            html += wrapToken('vf-code-block__token_string', escapeCodeHtml(fullMatch));
        } else if (match[4]) {
            html += wrapToken('vf-code-block__token_variable', escapeCodeHtml(fullMatch));
        } else if (match[5]) {
            html += wrapToken('vf-code-block__token_string', escapeCodeHtml(fullMatch));
        } else if (match[6]) {
            html += wrapToken('vf-code-block__token_keyword', escapeCodeHtml(fullMatch.trimStart()));
        } else if (match[7]) {
            const leadingWhitespace = fullMatch.match(/^\s*/)?.[0] ?? '';
            html += `${escapeCodeHtml(leadingWhitespace)}${wrapToken(
                'vf-code-block__token_directive',
                escapeCodeHtml(fullMatch.trimStart()),
            )}`;
        } else {
            html += escapeCodeHtml(fullMatch);
        }

        cursor = index + fullMatch.length;
    }

    html += escapeCodeHtml(line.slice(cursor));
    return html;
};

const highlightCssValues = (value: string) => {
    const tokenPattern = new RegExp(
        `(\\/\\*.*?\\*\\/)|((["'])(?:\\\\.|(?!\\3).)*\\3)|(#[0-9A-Fa-f]{3,8})|(@[A-Za-z-]+)|([A-Za-z_-][\\w-]*)(?=\\s*\\()|${cssNumberPattern}|\\b[A-Za-z_-][\\w-]*\\b`,
        'g',
    );
    let cursor = 0;
    let html = '';

    for (const match of value.matchAll(tokenPattern)) {
        const fullMatch = match[0] ?? '';
        const index = match.index ?? 0;

        html += escapeCodeHtml(value.slice(cursor, index));

        if (match[1]) {
            html += wrapToken('vf-code-block__token_comment', escapeCodeHtml(fullMatch));
        } else if (match[2]) {
            html += wrapToken('vf-code-block__token_string', escapeCodeHtml(fullMatch));
        } else if (/^#[0-9A-Fa-f]{3,8}$/.test(fullMatch)) {
            html += wrapToken('vf-code-block__token_number', escapeCodeHtml(fullMatch));
        } else if (fullMatch.startsWith('@')) {
            html += wrapToken('vf-code-block__token_keyword', escapeCodeHtml(fullMatch));
        } else if (readNextNonWhitespace(value, index + fullMatch.length) === '(') {
            html += wrapToken('vf-code-block__token_function', escapeCodeHtml(fullMatch));
        } else if (/^-?\d/.test(fullMatch)) {
            html += wrapToken('vf-code-block__token_number', escapeCodeHtml(fullMatch));
        } else {
            html += wrapToken('vf-code-block__token_variable', escapeCodeHtml(fullMatch));
        }

        cursor = index + fullMatch.length;
    }

    html += escapeCodeHtml(value.slice(cursor));
    return html;
};

const highlightCssLike = (line: string) => {
    const commentOnly = line.match(/^(\s*)(\/\*.*\*\/)(\s*)$/);
    if (commentOnly) {
        return `${escapeCodeHtml(commentOnly[1])}${wrapToken(
            'vf-code-block__token_comment',
            escapeCodeHtml(commentOnly[2]),
        )}${escapeCodeHtml(commentOnly[3])}`;
    }

    const selectorMatch = line.match(/^(\s*)([^{}][^{}]*?)(\s*)(\{|\})\s*$/);
    if (selectorMatch) {
        const [, indentation, selector, whitespace, brace] = selectorMatch;
        const trimmedSelector = selector.trim();
        const tokenClass =
            trimmedSelector === ':root' ||
            trimmedSelector.startsWith('.') ||
            trimmedSelector.startsWith('#') ||
            /^[A-Za-z_-][\w-]*$/.test(trimmedSelector)
                ? 'vf-code-block__token_selector'
                : 'vf-code-block__token_variable';

        return `${escapeCodeHtml(indentation)}${wrapToken(tokenClass, escapeCodeHtml(trimmedSelector))}${escapeCodeHtml(
            whitespace,
        )}${escapeCodeHtml(brace)}`;
    }

    const propertyMatch = line.match(/^(\s*)(--?[A-Za-z_][\w-]*|[A-Za-z_][\w-]*)(\s*:\s*)(.*)$/);
    if (propertyMatch) {
        const [, indentation, propertyName, separator, propertyValue] = propertyMatch;
        return `${escapeCodeHtml(indentation)}${wrapToken(
            'vf-code-block__token_property',
            escapeCodeHtml(propertyName),
        )}${escapeCodeHtml(separator)}${highlightCssValues(propertyValue)}`;
    }

    return highlightCssValues(line);
};

export const highlightCodeLine = (language: string, line: string, highlight = true): string => {
    if (!highlight) {
        return renderPlain(line);
    }

    const normalizedLanguage = language.toLowerCase();

    if (normalizedLanguage.includes('json')) {
        return highlightJson(line);
    }

    if (normalizedLanguage.includes('vue') || normalizedLanguage.includes('html')) {
        return highlightMarkupLike(line);
    }

    if (
        normalizedLanguage.includes('js') ||
        normalizedLanguage.includes('ts') ||
        normalizedLanguage.includes('javascript') ||
        normalizedLanguage.includes('typescript')
    ) {
        return highlightJsLike(line);
    }

    if (normalizedLanguage.includes('bash') || normalizedLanguage.includes('shell') || normalizedLanguage === 'sh') {
        return highlightBash(line);
    }

    if (
        normalizedLanguage.includes('css') ||
        normalizedLanguage.includes('scss') ||
        normalizedLanguage.includes('sass')
    ) {
        return highlightCssLike(line);
    }

    return renderPlain(line);
};

const highlightMarkupBlock = (code: string, highlight: boolean): string => {
    const lines = (code || '').replace(/\r\n/g, '\n').split('\n');
    let isInsideOpeningTag = false;
    let section: 'template' | 'script' | 'style' | null = null;
    let multilineAttributeState: { quote: '"' | "'"; directive: boolean } | null = null;

    return lines
        .map(rawLine => {
            const line = rawLine;

            if (!highlight) {
                return renderPlain(line);
            }

            const escaped = escapeCodeHtml(line);
            const trimmed = escaped.trim();

            if (!trimmed) {
                return escaped;
            }

            if (/^&lt;script\b/i.test(trimmed)) {
                section = 'script';
                const hasTagEnd = trimmed.includes('&gt;');
                isInsideOpeningTag = !hasTagEnd;
                return hasTagEnd ? highlightMarkupLike(line) : highlightMarkupOpeningStart(line);
            }

            if (/^&lt;template\b/i.test(trimmed)) {
                section = 'template';
                const hasTagEnd = trimmed.includes('&gt;');
                isInsideOpeningTag = !hasTagEnd;
                return hasTagEnd ? highlightMarkupLike(line) : highlightMarkupOpeningStart(line);
            }

            if (/^&lt;style\b/i.test(trimmed)) {
                section = 'style';
                const hasTagEnd = trimmed.includes('&gt;');
                isInsideOpeningTag = !hasTagEnd;
                return hasTagEnd ? highlightMarkupLike(line) : highlightMarkupOpeningStart(line);
            }

            if (
                /^&lt;\/script&gt;/i.test(trimmed) ||
                /^&lt;\/template&gt;/i.test(trimmed) ||
                /^&lt;\/style&gt;/i.test(trimmed)
            ) {
                section = null;
                isInsideOpeningTag = false;
                return highlightMarkupLike(line);
            }

            const hasTagStart = trimmed.startsWith('&lt;') && !trimmed.startsWith('&lt;/');
            const hasTagEnd = trimmed.includes('&gt;');

            if (hasTagStart) {
                const highlighted = hasTagEnd ? highlightMarkupLike(line) : highlightMarkupOpeningStart(line);
                isInsideOpeningTag = !hasTagEnd;
                return highlighted;
            }

            if (isInsideOpeningTag) {
                if (trimmed === '&gt;' || trimmed === '/&gt;') {
                    isInsideOpeningTag = false;
                    multilineAttributeState = null;
                    return escaped;
                }

                if (multilineAttributeState) {
                    const activeAttributeState = multilineAttributeState;
                    const closingQuoteIndex = line.indexOf(multilineAttributeState.quote);

                    if (closingQuoteIndex === -1) {
                        return highlightMultilineAttributeSegment(
                            line,
                            activeAttributeState.quote,
                            activeAttributeState.directive,
                            false,
                            false,
                        );
                    }

                    const valueSegment = line.slice(0, closingQuoteIndex);
                    const trailingSegment = line.slice(closingQuoteIndex + 1);
                    const trailingEscaped = escapeCodeHtml(trailingSegment);
                    multilineAttributeState = null;

                    if (trailingSegment.includes('>')) {
                        isInsideOpeningTag = false;
                    }

                    return `${highlightMultilineAttributeSegment(
                        valueSegment,
                        activeAttributeState.quote,
                        activeAttributeState.directive,
                        false,
                        true,
                    )}${trailingEscaped}`;
                }

                const multilineAttributeMatch = line.match(/^(\s+)([:@#]?[\w-]+(?::[\w-]+)?)(\s*=\s*)(["'])([\s\S]*)$/);
                if (multilineAttributeMatch) {
                    const [, whitespace, attributeName, equals, quote, initialValue] = multilineAttributeMatch;
                    const directive = isVueDirectiveAttribute(attributeName);
                    const closingQuoteIndex = initialValue.indexOf(quote);
                    const openingHtml = `${whitespace}${wrapToken(
                        directive ? 'vf-code-block__token_directive' : 'vf-code-block__token_attribute',
                        attributeName,
                    )}${escapeCodeHtml(equals)}`;

                    if (closingQuoteIndex === -1) {
                        multilineAttributeState = {
                            quote: quote as '"' | "'",
                            directive,
                        };

                        return `${openingHtml}${highlightMultilineAttributeSegment(
                            initialValue,
                            quote as '"' | "'",
                            directive,
                            true,
                            false,
                        )}`;
                    }

                    const valueSegment = initialValue.slice(0, closingQuoteIndex);
                    const trailingSegment = initialValue.slice(closingQuoteIndex + 1);

                    if (trailingSegment.includes('>')) {
                        isInsideOpeningTag = false;
                    }

                    return `${openingHtml}${highlightMultilineAttributeSegment(
                        valueSegment,
                        quote as '"' | "'",
                        directive,
                        true,
                        true,
                    )}${escapeCodeHtml(trailingSegment)}`;
                }

                const highlightedAttributes = highlightMarkupAttributes(escaped);
                if (hasTagEnd) {
                    isInsideOpeningTag = false;
                }
                return highlightedAttributes;
            }

            if (section === 'script') {
                return highlightJsLike(line);
            }

            return highlightMarkupLike(line);
        })
        .join('\n');
};

export const highlightCodeBlock = (language: string, code: string, highlight = true): string => {
    const normalizedLanguage = language.toLowerCase();

    if (normalizedLanguage.includes('vue') || normalizedLanguage.includes('html')) {
        return highlightMarkupBlock(code, highlight);
    }

    return (code || '')
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => highlightCodeLine(language, line, highlight))
        .join('\n');
};
