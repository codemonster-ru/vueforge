export type ThemeColorScheme = {
    light?: Record<string, string>;
    dark?: Record<string, string>;
};
export type ThemeSizes = {
    sm?: Record<string, string>;
    lg?: Record<string, string>;
};
export type ButtonTokens = {
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    roundedBorderRadius?: string;
    iconGap?: string;
    small?: {
        fontSize?: string;
        padding?: string;
    };
    large?: {
        fontSize?: string;
        padding?: string;
    };
    colorScheme?: Record<string, Record<string, Record<string, string>>>;
};
export type ButtonGroupTokens = {
    gap?: string;
    borderRadius?: string;
    disabledOpacity?: string;
};
export type CardTokens = {
    padding?: string;
    borderColor?: string;
    borderRadius?: string;
};
export type PanelTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    headerPadding?: string;
    bodyPadding?: string;
    footerPadding?: string;
    footerBorderColor?: string;
    headerGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    subtitleFontSize?: string;
    subtitleColor?: string;
    actionsGap?: string;
    toggleSize?: string;
    toggleRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    toggleHoverBackgroundColor?: string;
    disabledOpacity?: string;
    small?: {
        padding?: string;
        titleFontSize?: string;
    };
    large?: {
        padding?: string;
        titleFontSize?: string;
    };
};
export type FieldsetTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    legendPadding?: string;
    legendFontSize?: string;
    legendFontWeight?: string;
    legendColor?: string;
    contentPadding?: string;
    headerGap?: string;
    actionsGap?: string;
    toggleSize?: string;
    toggleRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    toggleHoverBackgroundColor?: string;
    disabledOpacity?: string;
};
export type ToolbarTokens = {
    padding?: string;
    densePadding?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    sectionGap?: string;
    controlGap?: string;
};
export type AppBarTokens = {
    height?: string;
    denseHeight?: string;
    padding?: string;
    densePadding?: string;
    mobilePadding?: string;
    gap?: string;
    actionsGap?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    zIndex?: string;
};
export type NavigationRailTokens = {
    width?: string;
    collapsedWidth?: string;
    padding?: string;
    gap?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    disabledOpacity?: string;
    toggleSize?: string;
    toggleRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    itemMinHeight?: string;
    itemPadding?: string;
    collapsedItemPadding?: string;
    itemBorderRadius?: string;
    itemGap?: string;
    itemContentGap?: string;
    itemColor?: string;
    itemHoverBackgroundColor?: string;
    itemActiveBackgroundColor?: string;
    itemActiveColor?: string;
    iconSize?: string;
    labelFontSize?: string;
};
export type BottomNavigationTokens = {
    height?: string;
    padding?: string;
    gap?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    zIndex?: string;
    disabledOpacity?: string;
    itemMinHeight?: string;
    itemPadding?: string;
    itemBorderRadius?: string;
    itemContentGap?: string;
    itemColor?: string;
    itemHoverBackgroundColor?: string;
    itemActiveBackgroundColor?: string;
    itemActiveColor?: string;
    iconSize?: string;
    labelFontSize?: string;
    badgeTextColor?: string;
    badgeBackgroundColor?: string;
};
export type FooterTokens = {
    minHeight?: string;
    denseMinHeight?: string;
    padding?: string;
    densePadding?: string;
    gap?: string;
    mobileGap?: string;
    sectionGap?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
};
export type SystemBarTokens = {
    height?: string;
    denseHeight?: string;
    padding?: string;
    densePadding?: string;
    gap?: string;
    sectionGap?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    zIndex?: string;
};
export type PageLayoutTokens = {
    minHeight?: string;
    gap?: string;
    backgroundColor?: string;
    textColor?: string;
    headerPadding?: string;
    headerBorderColor?: string;
    controlsGap?: string;
    contentPadding?: string;
    contentBackgroundColor?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    footerPadding?: string;
    footerBorderColor?: string;
    toggleSize?: string;
    toggleBorderRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    overlayBackgroundColor?: string;
    zIndex?: string;
};
export type MainLayoutRegionTokens = {
    padding?: string;
    maxWidth?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
};
export type SplitLayoutTokens = {
    minHeight?: string;
    gap?: string;
    padding?: string;
    panelPadding?: string;
    controlsGap?: string;
    backgroundColor?: string;
    textColor?: string;
    primaryBackgroundColor?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    toggleSize?: string;
    toggleBorderRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    overlayBackgroundColor?: string;
    zIndex?: string;
};
export type ResizableSidebarTokens = {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    disabledOpacity?: string;
    sectionPadding?: string;
    contentPadding?: string;
    toggleMargin?: string;
    toggleSize?: string;
    toggleBorderRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    resizerSize?: string;
};
export type StickyRegionTokens = {
    zIndex?: string;
    padding?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    shadow?: string;
};
export type BlockUiTokens = {
    zIndex?: string;
    gap?: string;
    textColor?: string;
    labelFontSize?: string;
    labelFontWeight?: string;
    overlayBackgroundColor?: string;
    overlayDimBackgroundColor?: string;
    blurSize?: string;
};
export type ScrollPanelTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    contentPadding?: string;
    focusRingColor?: string;
    scrollbarSize?: string;
    scrollbarTrackColor?: string;
    scrollbarThumbColor?: string;
};
export type ScrollTopTokens = {
    size?: string;
    padding?: string;
    gap?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    hoverBackgroundColor?: string;
    focusRingColor?: string;
    iconSize?: string;
    labelFontSize?: string;
    disabledOpacity?: string;
};
export type PickListTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    headerColor?: string;
    listPadding?: string;
    listMinHeight?: string;
    itemPadding?: string;
    itemRadius?: string;
    itemHoverBackgroundColor?: string;
    itemSelectedBackgroundColor?: string;
    itemSelectedColor?: string;
    focusRingColor?: string;
    buttonBorderColor?: string;
    buttonRadius?: string;
    buttonBackgroundColor?: string;
    buttonColor?: string;
    disabledOpacity?: string;
};
export type OrderListTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    headerColor?: string;
    listPadding?: string;
    listMinHeight?: string;
    itemPadding?: string;
    itemRadius?: string;
    itemHoverBackgroundColor?: string;
    itemSelectedBackgroundColor?: string;
    itemSelectedColor?: string;
    focusRingColor?: string;
    buttonBorderColor?: string;
    buttonRadius?: string;
    buttonBackgroundColor?: string;
    buttonColor?: string;
    disabledOpacity?: string;
};
export type ChartTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    gridColor?: string;
    axisColor?: string;
    axisLabelColor?: string;
    legendTextColor?: string;
    tooltipBackgroundColor?: string;
    tooltipTitleColor?: string;
    tooltipBodyColor?: string;
    tooltipBorderColor?: string;
    seriesPrimaryColor?: string;
    seriesSecondaryColor?: string;
    seriesTertiaryColor?: string;
    seriesQuaternaryColor?: string;
    seriesPositiveColor?: string;
    seriesWarningColor?: string;
    seriesNegativeColor?: string;
    titleFontFamily?: string;
    titleFontSize?: string;
    labelFontFamily?: string;
    labelFontSize?: string;
    valueFontFamily?: string;
    valueFontSize?: string;
    padding?: string;
    minHeight?: string;
    stateMinHeight?: string;
    stateTextColor?: string;
    stateFontSize?: string;
    stateBackgroundColor?: string;
    stateBorderColor?: string;
    stateBorderStyle?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    controlBorderColor?: string;
    controlHoverBackgroundColor?: string;
    tableHeaderBackgroundColor?: string;
    tableHeaderTextColor?: string;
    tableRowHoverBackgroundColor?: string;
    tableBorderColor?: string;
    focusOutlineColor?: string;
    focusOutlineOffset?: string;
};
export type ContainerTokens = {
    maxWidth?: string;
    maxWidthSm?: string;
    maxWidthMd?: string;
    maxWidthLg?: string;
    maxWidthXl?: string;
    paddingX?: string;
    paddingXSm?: string;
    paddingXLg?: string;
};
export type SectionTokens = {
    paddingY?: string;
    paddingYSm?: string;
    paddingYLg?: string;
    backgroundColorSurface?: string;
    backgroundColorMuted?: string;
    backgroundColorElevated?: string;
    borderColor?: string;
};
export type GridTokens = {
    columns?: string;
    gap?: string;
    columnGap?: string;
    rowGap?: string;
    alignItems?: string;
    justifyItems?: string;
    breakpointSm?: string;
    breakpointMd?: string;
    breakpointLg?: string;
    breakpointXl?: string;
};
export type StackTokens = {
    gap?: string;
    alignItems?: string;
    justifyContent?: string;
    wrap?: string;
};
export type InlineTokens = {
    gap?: string;
    alignItems?: string;
    justifyContent?: string;
    wrap?: string;
};
export type CheckboxTokens = {
    size?: string;
    gap?: string;
    borderRadius?: string;
    checkBorderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    checkedBackgroundColor?: string;
    checkedBorderColor?: string;
    checkColor?: string;
    textColor?: string;
    disabledOpacity?: string;
};
export type RadioTokens = {
    size?: string;
    dotSize?: string;
    gap?: string;
    groupGap?: string;
    borderRadius?: string;
    dotBorderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    checkedBackgroundColor?: string;
    checkedBorderColor?: string;
    dotColor?: string;
    textColor?: string;
    disabledOpacity?: string;
};
export type InputTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type InputGroupTokens = {
    gap?: string;
    borderRadius?: string;
    addonPadding?: string;
    addonFontSize?: string;
    addonBackgroundColor?: string;
    addonOutlinedBackgroundColor?: string;
    addonTextColor?: string;
    addonBorderColor?: string;
    disabledOpacity?: string;
    small?: {
        addonPadding?: string;
        addonFontSize?: string;
    };
    large?: {
        addonPadding?: string;
        addonFontSize?: string;
    };
};
export type IconFieldTokens = {
    iconSize?: string;
    iconColor?: string;
    slotOffset?: string;
    controlPaddingStart?: string;
    controlPaddingEnd?: string;
    disabledOpacity?: string;
};
export type InputIconTokens = {
    size?: string;
    color?: string;
};
export type InlineEditTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    actionsGap?: string;
    buttonPadding?: string;
    buttonRadius?: string;
    buttonBorderColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackgroundColor?: string;
    cancelButtonBackgroundColor?: string;
    cancelButtonTextColor?: string;
    cancelButtonBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        buttonPadding?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        buttonPadding?: string;
    };
};
export type InplaceTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    contentPadding?: string;
    actionsGap?: string;
    buttonPadding?: string;
    buttonRadius?: string;
    buttonBorderColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackgroundColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
};
export type ImageTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    overlayZIndex?: string;
    overlayPadding?: string;
    overlayBackgroundColor?: string;
    previewMaxWidth?: string;
    previewMaxHeight?: string;
    previewBorderRadius?: string;
    previewBackgroundColor?: string;
    previewShadow?: string;
    closeOffset?: string;
    closeSize?: string;
    closeBorderColor?: string;
    closeBackgroundColor?: string;
    closeTextColor?: string;
    toolbarOffset?: string;
    toolbarGap?: string;
    navOffset?: string;
    controlSize?: string;
    controlFontSize?: string;
    controlBorderColor?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    counterTextColor?: string;
    counterFontSize?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
};
export type IconTokens = {
    size?: string;
    color?: string;
    spinDuration?: string;
};
export type DockTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    shadow?: string;
    padding?: string;
    gap?: string;
    itemSize?: string;
    itemBorderRadius?: string;
    itemColor?: string;
    itemHoverBackgroundColor?: string;
    itemActiveBackgroundColor?: string;
    itemActiveColor?: string;
    iconSize?: string;
    labelFontSize?: string;
    disabledOpacity?: string;
};
export type GalleriaTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    stageGap?: string;
    maxHeight?: string;
    imageRadius?: string;
    imageBackgroundColor?: string;
    captionGap?: string;
    captionFontSize?: string;
    captionColor?: string;
    navSize?: string;
    navBorderColor?: string;
    navBackgroundColor?: string;
    navTextColor?: string;
    indicatorsGap?: string;
    indicatorColor?: string;
    indicatorActiveColor?: string;
    thumbnailsGap?: string;
    thumbnailsItemGap?: string;
    thumbnailSize?: string;
    thumbnailRadius?: string;
    thumbnailBorderColor?: string;
    thumbnailActiveBorderColor?: string;
    disabledOpacity?: string;
};
export type KnobTokens = {
    trackColor?: string;
    fillColor?: string;
    thumbColor?: string;
    thumbBorderColor?: string;
    valueFontSize?: string;
    valueColor?: string;
    textColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
};
export type TerminalTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontSize?: string;
    toolbarPadding?: string;
    actionsGap?: string;
    actionBorderColor?: string;
    actionRadius?: string;
    actionBackgroundColor?: string;
    actionTextColor?: string;
    actionPadding?: string;
    dividerColor?: string;
    bodyPadding?: string;
    entryGap?: string;
    timeFontSize?: string;
    timeColor?: string;
    promptColor?: string;
    entryNeutralColor?: string;
    entryInfoColor?: string;
    entrySuccessColor?: string;
    entryWarnColor?: string;
    entryErrorColor?: string;
    emptyColor?: string;
    disabledOpacity?: string;
};
export type SearchInputTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    iconSize?: string;
    iconColor?: string;
    clearSize?: string;
    clearRadius?: string;
    clearHoverBackgroundColor?: string;
    loadingSize?: string;
    loadingBorderColor?: string;
    loadingTopBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        iconSize?: string;
        clearSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        iconSize?: string;
        clearSize?: string;
    };
};
export type MentionInputTokens = {
    minWidth?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    optionPadding?: string;
    optionGap?: string;
    optionBorderRadius?: string;
    optionFontSize?: string;
    optionHoverBackgroundColor?: string;
    optionTriggerColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type PasswordInputTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    toggleSize?: string;
    toggleRadius?: string;
    toggleColor?: string;
    toggleHoverBackgroundColor?: string;
    strengthGap?: string;
    strengthTrackHeight?: string;
    strengthTrackRadius?: string;
    strengthTrackBackgroundColor?: string;
    strengthWeakColor?: string;
    strengthMediumColor?: string;
    strengthStrongColor?: string;
    metaFontSize?: string;
    hintColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type OtpInputTokens = {
    gap?: string;
    fontSize?: string;
    cellSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    small?: {
        cellSize?: string;
        padding?: string;
        fontSize?: string;
    };
    large?: {
        cellSize?: string;
        padding?: string;
        fontSize?: string;
    };
};
export type ColorPickerTokens = {
    minWidth?: string;
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    swatchSize?: string;
    swatchRadius?: string;
    panelPadding?: string;
    panelBorderColor?: string;
    panelBackgroundColor?: string;
    panelShadow?: string;
    panelGap?: string;
    rangeAccentColor?: string;
    presetSize?: string;
    presetRadius?: string;
    presetBorderColor?: string;
    presetHoverBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        swatchSize?: string;
        presetSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        swatchSize?: string;
        presetSize?: string;
    };
};
export type MaskedInputTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type NumberInputTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    controlWidth?: string;
    controlGap?: string;
    controlFontSize?: string;
    controlRadius?: string;
    controlBackgroundColor?: string;
    controlHoverBackgroundColor?: string;
    controlTextColor?: string;
    controlBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        controlWidth?: string;
        controlFontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        controlWidth?: string;
        controlFontSize?: string;
    };
};
export type FormTokens = {
    gap?: string;
    textColor?: string;
    disabledOpacity?: string;
};
export type FormFieldTokens = {
    gap?: string;
    textColor?: string;
    labelFontSize?: string;
    labelColor?: string;
    requiredColor?: string;
    hintFontSize?: string;
    hintColor?: string;
    errorColor?: string;
    errorBorderColor?: string;
    errorFocusBorderColor?: string;
    disabledOpacity?: string;
    small?: {
        gap?: string;
        labelFontSize?: string;
        hintFontSize?: string;
    };
    large?: {
        gap?: string;
        labelFontSize?: string;
        hintFontSize?: string;
    };
};
export type FloatLabelTokens = {
    labelOffsetX?: string;
    labelFloatingTop?: string;
    labelPadding?: string;
    labelFontSize?: string;
    labelFloatingFontSize?: string;
    labelColor?: string;
    labelFloatingColor?: string;
    labelBackgroundColor?: string;
    requiredColor?: string;
    invalidColor?: string;
    transition?: string;
    disabledOpacity?: string;
    small?: {
        labelFontSize?: string;
    };
    large?: {
        labelFontSize?: string;
    };
};
export type IftaLabelTokens = {
    offsetX?: string;
    offsetY?: string;
    padding?: string;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    requiredColor?: string;
    invalidColor?: string;
    disabledOpacity?: string;
    small?: {
        fontSize?: string;
    };
    large?: {
        fontSize?: string;
    };
};
export type TextareaTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    minHeight?: string;
    resize?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type RichTextEditorTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    minHeight?: string;
    resize?: string;
    toolbarGap?: string;
    toolbarPadding?: string;
    toolbarBorderColor?: string;
    toolbarBackgroundColor?: string;
    toolbarButtonMinWidth?: string;
    toolbarButtonPadding?: string;
    toolbarButtonRadius?: string;
    toolbarButtonBorderColor?: string;
    toolbarButtonBackgroundColor?: string;
    toolbarButtonTextColor?: string;
    toolbarButtonHoverBackgroundColor?: string;
    toolbarButtonActiveBackgroundColor?: string;
    counterFontSize?: string;
    counterColor?: string;
    counterDangerColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        toolbarButtonPadding?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        toolbarButtonPadding?: string;
    };
};
export type FileUploadTokens = {
    minHeight?: string;
    fontSize?: string;
    gap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    dragBackgroundColor?: string;
    listGap?: string;
    itemPadding?: string;
    itemBorderColor?: string;
    itemBackgroundColor?: string;
    itemRadius?: string;
    itemTextColor?: string;
    sizeTextColor?: string;
    buttonPadding?: string;
    buttonRadius?: string;
    buttonBorderColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackgroundColor?: string;
    removeSize?: string;
    removeRadius?: string;
    removeHoverBackgroundColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        buttonPadding?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        buttonPadding?: string;
    };
};
export type FileManagerTokens = {
    gap?: string;
    toolbarGap?: string;
    toolbarControlsGap?: string;
    viewGap?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    controlFontSize?: string;
    controlPadding?: string;
    controlActiveBackgroundColor?: string;
    controlActiveBorderColor?: string;
    controlActiveTextColor?: string;
    listGap?: string;
    gridGap?: string;
    gridMinWidth?: string;
    itemGap?: string;
    itemPadding?: string;
    itemBorderColor?: string;
    itemBorderRadius?: string;
    itemBackgroundColor?: string;
    itemTextColor?: string;
    itemSelectedBorderColor?: string;
    itemSelectedBackgroundColor?: string;
    thumbSize?: string;
    thumbRadius?: string;
    thumbBorderColor?: string;
    thumbBackgroundColor?: string;
    thumbFontSize?: string;
    thumbTextColor?: string;
    nameFontSize?: string;
    nameFontWeight?: string;
    detailsGap?: string;
    detailsFontSize?: string;
    detailsColor?: string;
    statePadding?: string;
    stateBorderColor?: string;
    stateBorderRadius?: string;
    stateColor?: string;
    previewZIndex?: string;
    previewPadding?: string;
    previewOverlayBackgroundColor?: string;
    previewMaxWidth?: string;
    previewMaxHeight?: string;
    previewGap?: string;
    previewBorderColor?: string;
    previewBorderRadius?: string;
    previewBackgroundColor?: string;
    previewTextColor?: string;
    previewDialogPadding?: string;
    previewImageRadius?: string;
    disabledOpacity?: string;
};
export type JsonViewerTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    indentSize?: string;
    toolbarGap?: string;
    toolbarGroupGap?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    controlFontSize?: string;
    controlPadding?: string;
    toggleSize?: string;
    rowGap?: string;
    rowMinHeight?: string;
    cellGap?: string;
    keyColor?: string;
    punctuationColor?: string;
    metaColor?: string;
    stringColor?: string;
    numberColor?: string;
    booleanColor?: string;
    nullColor?: string;
    emptyColor?: string;
};
export type DiffViewerTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    toolbarGap?: string;
    toolbarGroupGap?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    controlFontSize?: string;
    controlPadding?: string;
    controlActiveBackgroundColor?: string;
    controlActiveBorderColor?: string;
    controlActiveTextColor?: string;
    dividerColor?: string;
    cellPadding?: string;
    rowGap?: string;
    cellGap?: string;
    rowBorderRadius?: string;
    lineColor?: string;
    markerColor?: string;
    addedBackgroundColor?: string;
    removedBackgroundColor?: string;
    changedBackgroundColor?: string;
    emptyColor?: string;
};
export type CodeEditorTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    headerGap?: string;
    metaFontSize?: string;
    metaColor?: string;
    surfaceBorderColor?: string;
    surfaceBorderRadius?: string;
    surfaceBackgroundColor?: string;
    minHeight?: string;
    stateMinHeight?: string;
    stateColor?: string;
    stateFontSize?: string;
    darkBorderColor?: string;
    darkBackgroundColor?: string;
    darkTextColor?: string;
    darkSurfaceBorderColor?: string;
    darkSurfaceBackgroundColor?: string;
    darkMetaColor?: string;
    darkStateColor?: string;
    disabledOpacity?: string;
};
export type CodeBlockTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    padding?: string;
    headerGap?: string;
    headerPadding?: string;
    headerBorderColor?: string;
    metaGap?: string;
    metaColor?: string;
    metaFontSize?: string;
    filenameColor?: string;
    filenameFontWeight?: string;
    actionsGap?: string;
    actionBorderColor?: string;
    actionBorderRadius?: string;
    actionBackgroundColor?: string;
    actionTextColor?: string;
    actionPadding?: string;
    actionFontSize?: string;
    lineGap?: string;
    lineNumberColor?: string;
    lineNumberMinWidth?: string;
    tokenKeywordColor?: string;
    tokenStringColor?: string;
    tokenNumberColor?: string;
    tokenCommentColor?: string;
    tokenVariableColor?: string;
    disabledOpacity?: string;
};
export type SchedulerTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    subtitleFontSize?: string;
    subtitleColor?: string;
    resourceWidth?: string;
    minTimelineWidth?: string;
    minGridWidth?: string;
    gridGap?: string;
    headBackgroundColor?: string;
    headBorderRadius?: string;
    headPadding?: string;
    headFontSize?: string;
    headFontWeight?: string;
    dividerColor?: string;
    slotMinWidth?: string;
    slotLabelFontSize?: string;
    slotLabelColor?: string;
    rowBorderRadius?: string;
    resourcePadding?: string;
    resourceBackgroundColor?: string;
    resourceFontSize?: string;
    resourceFontWeight?: string;
    resourceMetaFontSize?: string;
    resourceMetaColor?: string;
    trackBackgroundColor?: string;
    trackPadding?: string;
    trackGap?: string;
    slotHeight?: string;
    slotHoverBackgroundColor?: string;
    eventHeight?: string;
    eventBackgroundColor?: string;
    eventTextColor?: string;
    eventBorderColor?: string;
    eventBorderRadius?: string;
    eventPadding?: string;
    eventFontSize?: string;
    eventTitleFontWeight?: string;
    eventTimeFontSize?: string;
    eventSelectedOutlineColor?: string;
};
export type BottomSheetTokens = {
    zIndex?: string;
    maxWidth?: string;
    maxHeight?: string;
    minHeightSm?: string;
    minHeight?: string;
    minHeightLg?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    overlayBackgroundColor?: string;
    shadow?: string;
    safeAreaBottom?: string;
    handleWidth?: string;
    handleHeight?: string;
    handleColor?: string;
    handleMargin?: string;
    headerGap?: string;
    headerPadding?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    closeSize?: string;
    closeRadius?: string;
    closeColor?: string;
    closeFontSize?: string;
    closeHoverBackgroundColor?: string;
    bodyPadding?: string;
    footerPadding?: string;
    footerGap?: string;
};
export type SheetTokens = {
    borderRadius?: string;
    borderColor?: string;
    sectionBorderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    tonalBackgroundColor?: string;
    tonalTextColor?: string;
    shadow?: string;
    shadowHover?: string;
    transition?: string;
    disabledOpacity?: string;
    headerPadding?: string;
    bodyPadding?: string;
    footerPadding?: string;
};
export type InfiniteScrollTokens = {
    gap?: string;
    sentinelMinHeight?: string;
    sentinelPadding?: string;
    textColor?: string;
    fontSize?: string;
    loadingColor?: string;
    errorColor?: string;
    endColor?: string;
    disabledOpacity?: string;
    hintWidth?: string;
    hintHeight?: string;
    hintColor?: string;
    retryBorderColor?: string;
    retryRadius?: string;
    retryBackgroundColor?: string;
    retryTextColor?: string;
    retryPadding?: string;
    retryFontSize?: string;
    retryHoverBackgroundColor?: string;
    focusRingColor?: string;
};
export type LinkTokens = {
    hoverColor?: string;
    activeColor?: string;
};
export type BreadcrumbsTokens = {
    gap?: string;
    fontSize?: string;
    textColor?: string;
    hoverColor?: string;
    activeColor?: string;
    separatorColor?: string;
    disabledOpacity?: string;
};
export type DividerTokens = {
    color?: string;
    textColor?: string;
    thickness?: string;
    minLength?: string;
    gap?: string;
    inset?: string;
    labelPadding?: string;
    labelFontSize?: string;
};
export type PageHeaderTokens = {
    gap?: string;
    contentGap?: string;
    breadcrumbGap?: string;
    actionsGap?: string;
    metaGap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    dividerColor?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    subtitleFontSize?: string;
    subtitleColor?: string;
    small?: {
        padding?: string;
        titleFontSize?: string;
        subtitleFontSize?: string;
    };
    large?: {
        padding?: string;
        titleFontSize?: string;
        subtitleFontSize?: string;
    };
};
export type MenuTokens = {
    iconGap?: string;
    submenuOffset?: string;
    separatorThickness?: string;
    separatorHeight?: string;
    separatorColor?: string;
    link?: {
        hoverColor?: string;
        activeColor?: string;
    };
    parent?: {
        hoverColor?: string;
        activeColor?: string;
    };
    item?: {
        marginTop?: string;
        marginRight?: string;
        marginBottom?: string;
        marginLeft?: string;
    };
};
export type MenuBarTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    padding?: string;
};
export type MegaMenuTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    padding?: string;
    rootGap?: string;
    triggerTextColor?: string;
    triggerPadding?: string;
    triggerBorderRadius?: string;
    triggerActiveBackgroundColor?: string;
    panelOffset?: string;
    zIndex?: string;
    panelMinWidth?: string;
    panelBorderColor?: string;
    panelBorderRadius?: string;
    panelBackgroundColor?: string;
    panelShadow?: string;
    panelPadding?: string;
    columnsGap?: string;
    sectionTitleGap?: string;
    sectionTitleFontSize?: string;
    sectionTitleColor?: string;
    linkGap?: string;
    linkColor?: string;
    linkHoverColor?: string;
};
export type PanelMenuTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    padding?: string;
    gap?: string;
    indent?: string;
    itemTextColor?: string;
    itemBorderRadius?: string;
    itemPadding?: string;
    itemHoverBackgroundColor?: string;
};
export type ModalTokens = {
    width?: string;
    maxWidth?: string;
    maxHeight?: string;
    widthSm?: string;
    maxWidthSm?: string;
    widthLg?: string;
    maxWidthLg?: string;
    padding?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    overlayBackgroundColor?: string;
    shadow?: string;
    zIndex?: string;
    headerGap?: string;
    bodyGap?: string;
    footerGap?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    closeSize?: string;
    closeRadius?: string;
    closeOffset?: string;
    closeColor?: string;
    closeFontSize?: string;
    closeHoverBackgroundColor?: string;
};
export type ConfirmDialogTokens = {
    maxWidth?: string;
    messageColor?: string;
    messageFontSize?: string;
    messageLineHeight?: string;
    actionsGap?: string;
};
export type ConfirmPopupTokens = {
    bodyGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    titleColor?: string;
    messageColor?: string;
    messageFontSize?: string;
    messageLineHeight?: string;
    actionsGap?: string;
};
export type DrawerTokens = {
    width?: string;
    widthSm?: string;
    widthLg?: string;
    height?: string;
    heightSm?: string;
    heightLg?: string;
    padding?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    overlayBackgroundColor?: string;
    shadow?: string;
    zIndex?: string;
    headerGap?: string;
    bodyGap?: string;
    footerGap?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    closeSize?: string;
    closeRadius?: string;
    closeOffset?: string;
    closeColor?: string;
    closeFontSize?: string;
    closeHoverBackgroundColor?: string;
};
export type PopoverTokens = {
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    shadow?: string;
};
export type DropdownTokens = {
    panelPadding?: string;
    panelBorderRadius?: string;
    panelBorderColor?: string;
    panelBackgroundColor?: string;
    panelShadow?: string;
    zIndex?: string;
    disabledOpacity?: string;
    itemPadding?: string;
};
export type SplitButtonTokens = {
    borderRadius?: string;
    toggleMinWidth?: string;
    togglePaddingX?: string;
    toggleIconSize?: string;
    disabledOpacity?: string;
    small?: {
        toggleMinWidth?: string;
    };
    large?: {
        toggleMinWidth?: string;
    };
};
export type ContextMenuTokens = {
    minWidth?: string;
    panelPadding?: string;
    panelBorderRadius?: string;
    panelBorderColor?: string;
    panelBackgroundColor?: string;
    panelShadow?: string;
    zIndex?: string;
    disabledOpacity?: string;
    itemPadding?: string;
};
export type CommandPaletteTokens = {
    width?: string;
    maxWidth?: string;
    maxHeight?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    overlayBackgroundColor?: string;
    shadow?: string;
    zIndex?: string;
    headerGap?: string;
    inputPadding?: string;
    inputBorderRadius?: string;
    inputBorderColor?: string;
    inputBackgroundColor?: string;
    inputTextColor?: string;
    inputPlaceholderColor?: string;
    inputFocusBorderColor?: string;
    inputFocusRingShadow?: string;
    listGap?: string;
    groupGap?: string;
    groupLabelPadding?: string;
    groupLabelColor?: string;
    groupLabelFontSize?: string;
    itemPadding?: string;
    itemBorderRadius?: string;
    itemGap?: string;
    itemTextColor?: string;
    itemDescriptionColor?: string;
    itemDescriptionFontSize?: string;
    itemActiveBackgroundColor?: string;
    itemActiveTextColor?: string;
    itemDisabledOpacity?: string;
    shortcutPadding?: string;
    shortcutBorderRadius?: string;
    shortcutBorderColor?: string;
    shortcutBackgroundColor?: string;
    shortcutTextColor?: string;
    shortcutFontSize?: string;
    emptyPadding?: string;
    emptyColor?: string;
};
export type NotificationCenterTokens = {
    zIndex?: string;
    overlayBackgroundColor?: string;
    top?: string;
    right?: string;
    width?: string;
    maxWidth?: string;
    maxHeight?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    shadow?: string;
    dividerColor?: string;
    headerGap?: string;
    headerPadding?: string;
    titleGap?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    badgeSize?: string;
    badgeBackgroundColor?: string;
    badgeTextColor?: string;
    badgeFontSize?: string;
    actionsGap?: string;
    closeSize?: string;
    closeHoverBackgroundColor?: string;
    disabledOpacity?: string;
    itemGap?: string;
    itemPadding?: string;
    unreadBackgroundColor?: string;
    avatarSize?: string;
    avatarBackgroundColor?: string;
    avatarTextColor?: string;
    avatarFontSize?: string;
    itemTitleFontSize?: string;
    itemTitleFontWeight?: string;
    itemMetaFontSize?: string;
    itemMetaColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
};
export type AppShellTokens = {
    gap?: string;
    backgroundColor?: string;
    textColor?: string;
    sidebarBackgroundColor?: string;
    sidebarBorderColor?: string;
    headerHeight?: string;
    headerPadding?: string;
    headerGap?: string;
    headerBackgroundColor?: string;
    headerBorderColor?: string;
    contentPadding?: string;
    mainBackgroundColor?: string;
    footerPadding?: string;
    footerBorderColor?: string;
    footerBackgroundColor?: string;
    toggleSize?: string;
    toggleBorderRadius?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    toggleHoverBackgroundColor?: string;
    overlayBackgroundColor?: string;
    zIndex?: string;
};
export type KanbanBoardTokens = {
    gap?: string;
    columnMinWidth?: string;
    columnGap?: string;
    columnBorderColor?: string;
    columnBorderRadius?: string;
    columnBackgroundColor?: string;
    columnHeaderPadding?: string;
    columnHeaderBorderColor?: string;
    columnTitleFontSize?: string;
    columnTitleFontWeight?: string;
    columnCountFontSize?: string;
    columnCountColor?: string;
    bodyPadding?: string;
    cardGap?: string;
    cardPadding?: string;
    cardBorderRadius?: string;
    cardBorderColor?: string;
    cardBackgroundColor?: string;
    cardHoverBorderColor?: string;
    cardTitleFontSize?: string;
    cardTitleFontWeight?: string;
    cardDescriptionFontSize?: string;
    cardDescriptionColor?: string;
    priorityLowColor?: string;
    priorityMediumColor?: string;
    priorityHighColor?: string;
    tagGap?: string;
    tagPadding?: string;
    tagBorderRadius?: string;
    tagBackgroundColor?: string;
    tagTextColor?: string;
    assigneeFontSize?: string;
    assigneeColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    columnFooterPadding?: string;
    columnFooterBorderColor?: string;
    dragOpacity?: string;
};
export type SelectTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type AutocompleteTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    optionHighlightedBackgroundColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    loadingPadding?: string;
    loadingColor?: string;
    chipGap?: string;
    chipPadding?: string;
    chipRadius?: string;
    chipBackgroundColor?: string;
    chipTextColor?: string;
    chipFontSize?: string;
    groupLabelPadding?: string;
    groupLabelColor?: string;
    groupLabelFontSize?: string;
    groupLabelFontWeight?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type ComboboxTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    optionHighlightedBackgroundColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    loadingPadding?: string;
    loadingColor?: string;
    clearSize?: string;
    clearRadius?: string;
    clearHoverBackgroundColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type MultiSelectTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    optionHighlightedBackgroundColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    loadingPadding?: string;
    loadingColor?: string;
    searchPadding?: string;
    searchBorderColor?: string;
    searchBorderRadius?: string;
    clearSize?: string;
    clearRadius?: string;
    clearHoverBackgroundColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type ListboxTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    minHeight?: string;
    maxHeight?: string;
    focusRingShadow?: string;
    focusBorderColor?: string;
    groupGapTop?: string;
    groupLabelPadding?: string;
    groupLabelColor?: string;
    groupLabelFontSize?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHighlightedBackgroundColor?: string;
    optionSelectedBackgroundColor?: string;
    optionSelectedTextColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    disabledOpacity?: string;
    small?: {
        optionPadding?: string;
        fontSize?: string;
    };
    large?: {
        optionPadding?: string;
        fontSize?: string;
    };
};
export type TagInputTokens = {
    minWidth?: string;
    minHeight?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionHighlightedBackgroundColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    loadingPadding?: string;
    loadingColor?: string;
    inputMinWidth?: string;
    chipGap?: string;
    chipPadding?: string;
    chipRadius?: string;
    chipBackgroundColor?: string;
    chipTextColor?: string;
    chipFontSize?: string;
    chipRemoveSize?: string;
    chipRemoveRadius?: string;
    chipRemoveHoverBackgroundColor?: string;
    clearSize?: string;
    clearRadius?: string;
    clearHoverBackgroundColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        chipPadding?: string;
        chipFontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        chipPadding?: string;
        chipFontSize?: string;
    };
};
export type DatePickerTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelWidth?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    headerGap?: string;
    headerPadding?: string;
    monthLabelFontSize?: string;
    monthLabelFontWeight?: string;
    navButtonSize?: string;
    navButtonRadius?: string;
    navButtonFontSize?: string;
    weekdayColor?: string;
    weekdayFontSize?: string;
    weekdaysMarginBottom?: string;
    daysGap?: string;
    daySize?: string;
    dayFontSize?: string;
    dayBorderRadius?: string;
    dayHoverBackgroundColor?: string;
    daySelectedBackgroundColor?: string;
    daySelectedTextColor?: string;
    dayMutedColor?: string;
    dayTodayBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
};
export type CalendarTokens = {
    width?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    disabledOpacity?: string;
    headerGap?: string;
    headerPadding?: string;
    monthLabelFontSize?: string;
    monthLabelFontWeight?: string;
    navButtonSize?: string;
    navButtonRadius?: string;
    navButtonFontSize?: string;
    weekdayColor?: string;
    weekdayFontSize?: string;
    weekdaysMarginBottom?: string;
    daysGap?: string;
    daySize?: string;
    dayFontSize?: string;
    dayBorderRadius?: string;
    dayHoverBackgroundColor?: string;
    daySelectedBackgroundColor?: string;
    daySelectedTextColor?: string;
    dayMutedColor?: string;
    dayTodayBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
};
export type DateRangePickerTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelWidth?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    headerGap?: string;
    headerPadding?: string;
    monthLabelFontSize?: string;
    monthLabelFontWeight?: string;
    navButtonSize?: string;
    navButtonRadius?: string;
    navButtonFontSize?: string;
    weekdayColor?: string;
    weekdayFontSize?: string;
    weekdaysMarginBottom?: string;
    daysGap?: string;
    daySize?: string;
    dayFontSize?: string;
    dayBorderRadius?: string;
    dayHoverBackgroundColor?: string;
    daySelectedBackgroundColor?: string;
    daySelectedTextColor?: string;
    dayRangeBackgroundColor?: string;
    dayRangeTextColor?: string;
    dayMutedColor?: string;
    dayTodayBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
};
export type TimePickerTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type DateTimePickerTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelWidth?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    panelGap?: string;
    focusRingShadow?: string;
    headerGap?: string;
    headerPadding?: string;
    monthLabelFontSize?: string;
    monthLabelFontWeight?: string;
    navButtonSize?: string;
    navButtonRadius?: string;
    navButtonFontSize?: string;
    weekdayColor?: string;
    weekdayFontSize?: string;
    weekdaysMarginBottom?: string;
    daysGap?: string;
    daySize?: string;
    dayFontSize?: string;
    dayBorderRadius?: string;
    dayHoverBackgroundColor?: string;
    daySelectedBackgroundColor?: string;
    daySelectedTextColor?: string;
    dayMutedColor?: string;
    dayTodayBorderColor?: string;
    timesWidth?: string;
    timesMaxHeight?: string;
    timesPaddingLeft?: string;
    timesBorderColor?: string;
    timeOptionPadding?: string;
    timeOptionBorderRadius?: string;
    timeOptionFontSize?: string;
    timeOptionHoverBackgroundColor?: string;
    timeOptionActiveBackgroundColor?: string;
    timeOptionActiveTextColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
};
export type PaginationTokens = {
    gap?: string;
    itemMinWidth?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    hoverBackgroundColor?: string;
    activeBorderColor?: string;
    activeBackgroundColor?: string;
    activeTextColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    ellipsisPadding?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type SwitchTokens = {
    width?: string;
    height?: string;
    thumbSize?: string;
    gap?: string;
    thumbOffset?: string;
    thumbTranslateOffset?: string;
    backgroundColor?: string;
    checkedBackgroundColor?: string;
    thumbColor?: string;
    textColor?: string;
    disabledOpacity?: string;
};
export type SelectionControlTokens = {
    gap?: string;
    textColor?: string;
    disabledOpacity?: string;
    boxSize?: string;
    boxBorderRadius?: string;
    boxBorderColor?: string;
    boxBackgroundColor?: string;
    boxCheckedBackgroundColor?: string;
    boxCheckedBorderColor?: string;
    boxCheckColor?: string;
    boxCheckRadius?: string;
    radioSize?: string;
    radioBorderColor?: string;
    radioBackgroundColor?: string;
    radioCheckedBackgroundColor?: string;
    radioCheckedBorderColor?: string;
    radioDotSize?: string;
    radioDotColor?: string;
    switchWidth?: string;
    switchHeight?: string;
    switchThumbSize?: string;
    switchThumbOffset?: string;
    switchThumbTranslateOffset?: string;
    switchBackgroundColor?: string;
    switchCheckedBackgroundColor?: string;
    switchThumbColor?: string;
};
export type SelectionControlGroupTokens = {
    gap?: string;
    horizontalGap?: string;
};
export type SegmentedControlTokens = {
    fontSize?: string;
    padding?: string;
    gap?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    activeTextColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    segmentPadding?: string;
    segmentRadius?: string;
    segmentFontWeight?: string;
    small?: {
        fontSize?: string;
        padding?: string;
        segmentPadding?: string;
    };
    large?: {
        fontSize?: string;
        padding?: string;
        segmentPadding?: string;
    };
};
export type ThemeModeSwitchTokens = {
    fontSize?: string;
    padding?: string;
    gap?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    activeTextColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    segmentPadding?: string;
    segmentRadius?: string;
    segmentFontWeight?: string;
    small?: {
        fontSize?: string;
        padding?: string;
        segmentPadding?: string;
    };
    large?: {
        fontSize?: string;
        padding?: string;
        segmentPadding?: string;
    };
};
export type ToggleButtonTokens = {
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    hoverBackgroundColor?: string;
    activeBorderColor?: string;
    activeBackgroundColor?: string;
    activeTextColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    iconGap?: string;
    small?: {
        fontSize?: string;
        padding?: string;
    };
    large?: {
        fontSize?: string;
        padding?: string;
    };
};
export type HoverTokens = {
    disabledOpacity?: string;
};
export type KbdTokens = {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    gap?: string;
    keyPadding?: string;
    keyMinWidth?: string;
    keyBorderRadius?: string;
    keyBorderColor?: string;
    keyBackgroundColor?: string;
    keyTextColor?: string;
    keyShadow?: string;
    separatorColor?: string;
    disabledOpacity?: string;
    small?: {
        fontSize?: string;
        keyPadding?: string;
        keyMinWidth?: string;
    };
    large?: {
        fontSize?: string;
        keyPadding?: string;
        keyMinWidth?: string;
    };
};
export type LazyTokens = {
    placeholderMinHeight?: string;
    placeholderBorderRadius?: string;
    placeholderBackgroundColor?: string;
    disabledOpacity?: string;
};
export type ParallaxTokens = {
    overflow?: string;
    transformOrigin?: string;
    transition?: string;
    disabledOpacity?: string;
};
export type TabsTokens = {
    gap?: string;
    listGap?: string;
    listBorderWidth?: string;
    listBorderColor?: string;
    listVerticalPadding?: string;
    tabPadding?: string;
    tabFontSize?: string;
    tabBorderRadius?: string;
    tabTextColor?: string;
    tabBackgroundColor?: string;
    tabHoverBackgroundColor?: string;
    tabActiveTextColor?: string;
    tabActiveBackgroundColor?: string;
    tabActiveBorderColor?: string;
    tabActiveBorderWidth?: string;
    panelPadding?: string;
    panelBorderRadius?: string;
    panelBackgroundColor?: string;
    panelTextColor?: string;
    disabledOpacity?: string;
};
export type AccordionTokens = {
    gap?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    headerGap?: string;
    headerPadding?: string;
    headerFontSize?: string;
    headerFontWeight?: string;
    headerTextColor?: string;
    headerBackgroundColor?: string;
    headerHoverBackgroundColor?: string;
    headerActiveBackgroundColor?: string;
    contentPadding?: string;
    contentTextColor?: string;
    contentBackgroundColor?: string;
    iconSize?: string;
    iconColor?: string;
    dividerColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    small?: {
        headerPadding?: string;
        headerFontSize?: string;
        contentPadding?: string;
    };
    large?: {
        headerPadding?: string;
        headerFontSize?: string;
        contentPadding?: string;
    };
};
export type TooltipTokens = {
    padding?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    lineHeight?: string;
    shadow?: string;
    zIndex?: string;
    maxWidth?: string;
    arrowSize?: string;
};
export type SkeletonTokens = {
    width?: string;
    height?: string;
    lineHeight?: string;
    borderRadius?: string;
    backgroundColor?: string;
    shimmerColor?: string;
    animationDuration?: string;
    presetGap?: string;
    presetTableHeaderHeight?: string;
    presetTableRowHeight?: string;
    presetListAvatarSize?: string;
    presetListLineHeight?: string;
    presetListSecondaryWidth?: string;
    presetFormLabelWidth?: string;
    presetFormLabelHeight?: string;
    presetFormFieldHeight?: string;
};
export type ProgressTokens = {
    width?: string;
    height?: string;
    borderRadius?: string;
    backgroundColor?: string;
    barColor?: string;
    labelColor?: string;
    labelFontSize?: string;
    gap?: string;
    circularSize?: string;
    circularThickness?: string;
    animationDuration?: string;
    info?: {
        barColor?: string;
    };
    success?: {
        barColor?: string;
    };
    warn?: {
        barColor?: string;
    };
    danger?: {
        barColor?: string;
    };
    small?: {
        height?: string;
        labelFontSize?: string;
        circularSize?: string;
        circularThickness?: string;
    };
    large?: {
        height?: string;
        labelFontSize?: string;
        circularSize?: string;
        circularThickness?: string;
    };
};
export type SpinnerTokens = {
    size?: string;
    thickness?: string;
    color?: string;
    trackColor?: string;
    gap?: string;
    labelColor?: string;
    labelFontSize?: string;
    animationDuration?: string;
    overlayMinHeight?: string;
    overlayPadding?: string;
    overlayBorderRadius?: string;
    overlayBackgroundColor?: string;
    info?: {
        color?: string;
    };
    success?: {
        color?: string;
    };
    warn?: {
        color?: string;
    };
    danger?: {
        color?: string;
    };
    small?: {
        size?: string;
        thickness?: string;
        labelFontSize?: string;
    };
    large?: {
        size?: string;
        thickness?: string;
        labelFontSize?: string;
    };
};
export type SliderTokens = {
    width?: string;
    gap?: string;
    textColor?: string;
    trackHeight?: string;
    trackBackgroundColor?: string;
    trackRadius?: string;
    fillBackgroundColor?: string;
    thumbSize?: string;
    thumbColor?: string;
    thumbBorderColor?: string;
    thumbBorderWidth?: string;
    thumbShadow?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    markSize?: string;
    markColor?: string;
    markLabelFontSize?: string;
    markLabelColor?: string;
    marksHeight?: string;
    valueFontSize?: string;
    valueColor?: string;
    small?: {
        trackHeight?: string;
        thumbSize?: string;
        valueFontSize?: string;
    };
    large?: {
        trackHeight?: string;
        thumbSize?: string;
        valueFontSize?: string;
    };
};
export type RatingTokens = {
    gap?: string;
    size?: string;
    color?: string;
    activeColor?: string;
    hoverColor?: string;
    focusRingShadow?: string;
    focusRadius?: string;
    disabledOpacity?: string;
    small?: {
        size?: string;
    };
    large?: {
        size?: string;
    };
};
export type TreeTokens = {
    gap?: string;
    indent?: string;
    rowGap?: string;
    rowPadding?: string;
    rowPaddingInline?: string;
    rowBorderRadius?: string;
    rowBorderColor?: string;
    rowFontSize?: string;
    rowTextColor?: string;
    rowBackgroundColor?: string;
    rowHoverBackgroundColor?: string;
    rowSelectedBackgroundColor?: string;
    rowSelectedTextColor?: string;
    toggleSize?: string;
    toggleRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    toggleHoverBackgroundColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    small?: {
        rowPadding?: string;
        rowPaddingInline?: string;
        rowFontSize?: string;
        toggleSize?: string;
    };
    large?: {
        rowPadding?: string;
        rowPaddingInline?: string;
        rowFontSize?: string;
        toggleSize?: string;
    };
};
export type OrgChartTokens = {
    gap?: string;
    childrenMarginTop?: string;
    connectorColor?: string;
    textColor?: string;
    cardMinWidth?: string;
    cardMaxWidth?: string;
    cardGap?: string;
    cardPadding?: string;
    cardBorderColor?: string;
    cardBorderRadius?: string;
    cardBackgroundColor?: string;
    cardTextColor?: string;
    cardHoverBackgroundColor?: string;
    cardSelectedBackgroundColor?: string;
    cardSelectedColor?: string;
    toggleSize?: string;
    toggleRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    focusRingColor?: string;
    labelFontSize?: string;
    labelFontWeight?: string;
    titleFontSize?: string;
    titleColor?: string;
    disabledOpacity?: string;
    small?: {
        cardPadding?: string;
        labelFontSize?: string;
    };
    large?: {
        cardPadding?: string;
        labelFontSize?: string;
    };
};
export type TreeSelectTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    searchPadding?: string;
    searchBorderColor?: string;
    searchBorderRadius?: string;
    emptyPadding?: string;
    emptyColor?: string;
    loadingPadding?: string;
    loadingColor?: string;
    clearSize?: string;
    clearRadius?: string;
    clearHoverBackgroundColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type VirtualScrollerTokens = {
    fontSize?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    focusRingShadow?: string;
    itemPadding?: string;
    itemBorderColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
};
export type SplitterTokens = {
    borderColor?: string;
    borderRadius?: string;
    panelBackgroundColor?: string;
    handleWidth?: string;
    handleHeight?: string;
    handleRadius?: string;
    handleColor?: string;
    gutterActiveBackgroundColor?: string;
    disabledOpacity?: string;
};
export type TourTokens = {
    zIndex?: string;
    overlayBackgroundColor?: string;
    width?: string;
    maxWidth?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    shadow?: string;
    titleGap?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    contentGap?: string;
    contentFontSize?: string;
    contentLineHeight?: string;
    contentColor?: string;
    progressGap?: string;
    progressFontSize?: string;
    progressColor?: string;
    actionsGap?: string;
    buttonMinWidth?: string;
    buttonPadding?: string;
    buttonRadius?: string;
    buttonBorderColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackgroundColor?: string;
    secondaryButtonBorderColor?: string;
    secondaryButtonBackgroundColor?: string;
    secondaryButtonTextColor?: string;
    secondaryButtonHoverBackgroundColor?: string;
    spotlightRadius?: string;
    spotlightBorderWidth?: string;
    spotlightBorderColor?: string;
    disabledOpacity?: string;
};
export type StepperTokens = {
    gap?: string;
    itemGap?: string;
    lineThickness?: string;
    lineLength?: string;
    lineColor?: string;
    indicatorSize?: string;
    indicatorBorderRadius?: string;
    indicatorBorderWidth?: string;
    indicatorFontSize?: string;
    indicatorBackgroundColor?: string;
    indicatorTextColor?: string;
    indicatorBorderColor?: string;
    activeIndicatorBackgroundColor?: string;
    activeIndicatorTextColor?: string;
    activeIndicatorBorderColor?: string;
    completedIndicatorBackgroundColor?: string;
    completedIndicatorTextColor?: string;
    completedIndicatorBorderColor?: string;
    errorIndicatorBackgroundColor?: string;
    errorIndicatorTextColor?: string;
    errorIndicatorBorderColor?: string;
    labelFontSize?: string;
    labelColor?: string;
    descriptionFontSize?: string;
    descriptionColor?: string;
    disabledOpacity?: string;
    small?: {
        indicatorSize?: string;
        indicatorFontSize?: string;
        labelFontSize?: string;
        descriptionFontSize?: string;
        lineLength?: string;
        itemGap?: string;
    };
    large?: {
        indicatorSize?: string;
        indicatorFontSize?: string;
        labelFontSize?: string;
        descriptionFontSize?: string;
        lineLength?: string;
        itemGap?: string;
    };
};
export type WizardTokens = {
    gap?: string;
    borderColor?: string;
    headerPaddingBottom?: string;
    itemGap?: string;
    stepGap?: string;
    indicatorSize?: string;
    indicatorBorderRadius?: string;
    indicatorFontSize?: string;
    indicatorBorderColor?: string;
    indicatorBackgroundColor?: string;
    indicatorTextColor?: string;
    activeIndicatorBorderColor?: string;
    activeIndicatorBackgroundColor?: string;
    activeIndicatorTextColor?: string;
    completedIndicatorBorderColor?: string;
    completedIndicatorBackgroundColor?: string;
    completedIndicatorTextColor?: string;
    errorIndicatorBorderColor?: string;
    errorIndicatorBackgroundColor?: string;
    errorIndicatorTextColor?: string;
    titleFontSize?: string;
    titleColor?: string;
    descriptionFontSize?: string;
    descriptionColor?: string;
    actionsGap?: string;
    buttonMinWidth?: string;
    buttonPadding?: string;
    buttonBorderRadius?: string;
    buttonBorderColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackgroundColor?: string;
    secondaryButtonBorderColor?: string;
    secondaryButtonBackgroundColor?: string;
    secondaryButtonTextColor?: string;
    secondaryButtonHoverBackgroundColor?: string;
    disabledOpacity?: string;
};
export type TimelineTokens = {
    gap?: string;
    itemGap?: string;
    markerSize?: string;
    markerBorderRadius?: string;
    markerBorderWidth?: string;
    markerBackgroundColor?: string;
    markerBorderColor?: string;
    markerTextColor?: string;
    markerIconSize?: string;
    dotSize?: string;
    lineThickness?: string;
    lineLength?: string;
    lineColor?: string;
    titleFontSize?: string;
    titleColor?: string;
    descriptionFontSize?: string;
    descriptionColor?: string;
    dateFontSize?: string;
    dateColor?: string;
    info?: {
        markerBackgroundColor?: string;
        markerBorderColor?: string;
        markerTextColor?: string;
        lineColor?: string;
    };
    success?: {
        markerBackgroundColor?: string;
        markerBorderColor?: string;
        markerTextColor?: string;
        lineColor?: string;
    };
    warn?: {
        markerBackgroundColor?: string;
        markerBorderColor?: string;
        markerTextColor?: string;
        lineColor?: string;
    };
    danger?: {
        markerBackgroundColor?: string;
        markerBorderColor?: string;
        markerTextColor?: string;
        lineColor?: string;
    };
    small?: {
        itemGap?: string;
        markerSize?: string;
        markerIconSize?: string;
        dotSize?: string;
        lineLength?: string;
        dateFontSize?: string;
        titleFontSize?: string;
        descriptionFontSize?: string;
    };
    large?: {
        itemGap?: string;
        markerSize?: string;
        markerIconSize?: string;
        dotSize?: string;
        lineLength?: string;
        dateFontSize?: string;
        titleFontSize?: string;
        descriptionFontSize?: string;
    };
};
export type ActivityFeedTokens = {
    gap?: string;
    groupGap?: string;
    groupTitleFontSize?: string;
    groupTitleColor?: string;
    groupTitleFontWeight?: string;
    itemGap?: string;
    itemPadding?: string;
    itemBorderColor?: string;
    itemBorderRadius?: string;
    itemBackgroundColor?: string;
    contentGap?: string;
    avatarSize?: string;
    avatarFontSize?: string;
    avatarBackgroundColor?: string;
    avatarTextColor?: string;
    titleFontSize?: string;
    titleColor?: string;
    titleFontWeight?: string;
    descriptionFontSize?: string;
    descriptionColor?: string;
    metaGap?: string;
    metaFontSize?: string;
    metaColor?: string;
    actorFontWeight?: string;
    actionColor?: string;
    actionFontSize?: string;
    infoBorderColor?: string;
    successBorderColor?: string;
    warnBorderColor?: string;
    dangerBorderColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
};
export type AuditLogViewerTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    dividerColor?: string;
    headerBackgroundColor?: string;
    fontSize?: string;
    cellPadding?: string;
    eventFontWeight?: string;
    metaColor?: string;
    metaFontSize?: string;
    actionColor?: string;
    actionFontSize?: string;
    detailsGap?: string;
    sectionTitleFontSize?: string;
    monoFontFamily?: string;
    monoFontSize?: string;
};
export type CommentThreadTokens = {
    gap?: string;
    itemGap?: string;
    indentSize?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    padding?: string;
    resolvedBackgroundColor?: string;
    resolvedBorderColor?: string;
    metaGap?: string;
    authorFontWeight?: string;
    metaColor?: string;
    metaFontSize?: string;
    actionsGap?: string;
    actionColor?: string;
    actionFontSize?: string;
    replyMinHeight?: string;
    replyBorderColor?: string;
    replyBorderRadius?: string;
    replyBackgroundColor?: string;
    disabledOpacity?: string;
};
export type MemberPickerTokens = {
    controlMinHeight?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    gap?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    chipGap?: string;
    chipBackgroundColor?: string;
    chipBorderColor?: string;
    chipBorderRadius?: string;
    chipFontSize?: string;
    chipRemoveFontSize?: string;
    zIndex?: string;
    panelBorderColor?: string;
    panelBorderRadius?: string;
    panelBackgroundColor?: string;
    panelShadow?: string;
    panelMaxHeight?: string;
    optionPadding?: string;
    optionGap?: string;
    optionHighlightBackgroundColor?: string;
    optionSelectedBackgroundColor?: string;
    optionTitleFontSize?: string;
    optionTitleFontWeight?: string;
    optionMetaFontSize?: string;
    optionMetaColor?: string;
    statePadding?: string;
};
export type PermissionMatrixTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    dividerColor?: string;
    headerBackgroundColor?: string;
    stickyBackgroundColor?: string;
    cellPadding?: string;
    labelFontSize?: string;
    labelFontWeight?: string;
    descriptionFontSize?: string;
    descriptionColor?: string;
    toggleMinWidth?: string;
    toggleBorderColor?: string;
    toggleBorderRadius?: string;
    togglePadding?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    toggleFontSize?: string;
    allowBorderColor?: string;
    allowBackgroundColor?: string;
    allowTextColor?: string;
    denyBorderColor?: string;
    denyBackgroundColor?: string;
    denyTextColor?: string;
    disabledOpacity?: string;
};
export type KpiStatCardTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    gap?: string;
    headerGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    subtitleFontSize?: string;
    subtitleColor?: string;
    valueGap?: string;
    valueFontSize?: string;
    valueFontWeight?: string;
    trendGap?: string;
    trendFontSize?: string;
    trendColor?: string;
    upColor?: string;
    downColor?: string;
    captionFontSize?: string;
    captionColor?: string;
};
export type MeterGroupTokens = {
    gap?: string;
    itemGap?: string;
    itemBorderColor?: string;
    itemBorderRadius?: string;
    itemBackgroundColor?: string;
    itemPadding?: string;
    headerGap?: string;
    labelFontSize?: string;
    labelFontWeight?: string;
    valueFontSize?: string;
    valueColor?: string;
    trackHeight?: string;
    trackBorderRadius?: string;
    trackBackgroundColor?: string;
    barColor?: string;
    warnBarColor?: string;
    dangerBarColor?: string;
    descriptionFontSize?: string;
    descriptionColor?: string;
};
export type OverlayBadgeTokens = {
    minSize?: string;
    dotSize?: string;
    paddingX?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    zIndex?: string;
    topOffset?: string;
    rightOffset?: string;
    bottomOffset?: string;
    leftOffset?: string;
    neutralBackgroundColor?: string;
    neutralTextColor?: string;
    neutralBorderColor?: string;
    infoBackgroundColor?: string;
    infoTextColor?: string;
    infoBorderColor?: string;
    successBackgroundColor?: string;
    successTextColor?: string;
    successBorderColor?: string;
    warnBackgroundColor?: string;
    warnTextColor?: string;
    warnBorderColor?: string;
    dangerBackgroundColor?: string;
    dangerTextColor?: string;
    dangerBorderColor?: string;
};
export type DataTableTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    fontSize?: string;
    textColor?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
    headerFontSize?: string;
    headerFontWeight?: string;
    headerBorderColor?: string;
    headerGap?: string;
    rowBackgroundColor?: string;
    rowTextColor?: string;
    rowBorderColor?: string;
    cellPadding?: string;
    stripedBackgroundColor?: string;
    hoverBackgroundColor?: string;
    sortIconColor?: string;
    sortIconActiveColor?: string;
    sortIconSize?: string;
    statePadding?: string;
    stateTextColor?: string;
    small?: {
        fontSize?: string;
        cellPadding?: string;
    };
    large?: {
        fontSize?: string;
        cellPadding?: string;
    };
};
export type TreeTableTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
    headerFontWeight?: string;
    headerBorderColor?: string;
    rowBackgroundColor?: string;
    rowBorderColor?: string;
    rowHoverBackgroundColor?: string;
    rowSelectedBackgroundColor?: string;
    rowSelectedTextColor?: string;
    rowStripedBackgroundColor?: string;
    cellPadding?: string;
    cellGap?: string;
    indentStep?: string;
    toggleSize?: string;
    toggleBorderRadius?: string;
    toggleBorderColor?: string;
    toggleBackgroundColor?: string;
    toggleTextColor?: string;
    focusRingColor?: string;
    statePadding?: string;
    stateTextColor?: string;
    disabledOpacity?: string;
    small?: {
        fontSize?: string;
        cellPadding?: string;
    };
    large?: {
        fontSize?: string;
        cellPadding?: string;
    };
};
export type DataViewTokens = {
    gap?: string;
    toolbarGap?: string;
    layoutGap?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    controlPadding?: string;
    controlFontSize?: string;
    controlActiveBackgroundColor?: string;
    controlActiveBorderColor?: string;
    controlActiveTextColor?: string;
    listGap?: string;
    gridGap?: string;
    gridMinWidth?: string;
    itemBorderColor?: string;
    itemBorderRadius?: string;
    itemBackgroundColor?: string;
    itemTextColor?: string;
    itemPadding?: string;
    statePadding?: string;
    stateTextColor?: string;
    paginationGap?: string;
    disabledOpacity?: string;
};
export type CarouselTokens = {
    gap?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    slideMinHeight?: string;
    slidePadding?: string;
    transitionDuration?: string;
    transitionEasing?: string;
    arrowSize?: string;
    arrowSizeMobile?: string;
    arrowOffset?: string;
    arrowBorderColor?: string;
    arrowBorderRadius?: string;
    arrowBackgroundColor?: string;
    arrowTextColor?: string;
    indicatorsGap?: string;
    indicatorSize?: string;
    indicatorBorderColor?: string;
    indicatorBackgroundColor?: string;
    indicatorActiveBorderColor?: string;
    indicatorActiveBackgroundColor?: string;
    focusRingShadow?: string;
    focusBorderColor?: string;
    disabledOpacity?: string;
};
export type SpeedDialTokens = {
    gap?: string;
    zIndex?: string;
    offsetX?: string;
    offsetY?: string;
    offsetXMobile?: string;
    offsetYMobile?: string;
    transitionDuration?: string;
    transitionEasing?: string;
    triggerSize?: string;
    triggerPaddingX?: string;
    triggerBorderRadius?: string;
    triggerBorderColor?: string;
    triggerBackgroundColor?: string;
    triggerTextColor?: string;
    triggerShadow?: string;
    actionSize?: string;
    actionPaddingX?: string;
    actionBorderRadius?: string;
    actionBorderColor?: string;
    actionBackgroundColor?: string;
    actionTextColor?: string;
    actionShadow?: string;
    labelBackgroundColor?: string;
    labelTextColor?: string;
    labelPadding?: string;
    focusRingShadow?: string;
    focusBorderColor?: string;
    disabledOpacity?: string;
};
export type ToastTokens = {
    gap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    shadow?: string;
    minWidth?: string;
    fontSize?: string;
    lineHeight?: string;
    bodyGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    closeSize?: string;
    containerGap?: string;
    containerPadding?: string;
    containerMaxWidth?: string;
    zIndex?: string;
    info?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    success?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    warn?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    danger?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
};
export type SnackbarQueueTokens = {
    actionGap?: string;
    actionPadding?: string;
    actionRadius?: string;
    actionBorderColor?: string;
    actionBackgroundColor?: string;
    actionTextColor?: string;
    actionHoverBackgroundColor?: string;
};
export type AlertTokens = {
    gap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
    fontSize?: string;
    lineHeight?: string;
    bodyGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    actionsGap?: string;
    closeSize?: string;
    closeRadius?: string;
    closeFontSize?: string;
    closeHoverBackgroundColor?: string;
    info?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    success?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    warn?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    danger?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
};
export type BannerTokens = {
    gap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
    fontSize?: string;
    lineHeight?: string;
    bodyGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    actionsGap?: string;
    closeSize?: string;
    closeRadius?: string;
    closeFontSize?: string;
    closeHoverBackgroundColor?: string;
    stickyTop?: string;
    zIndex?: string;
    info?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    success?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    warn?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    danger?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
};
export type InlineMessageTokens = {
    gap?: string;
    paddingX?: string;
    paddingY?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
    iconSize?: string;
    fontSize?: string;
    lineHeight?: string;
    bodyGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    info?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    success?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    warn?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    danger?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    small?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
    large?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
};
export type EmptyStateTokens = {
    gap?: string;
    bodyGap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    maxWidth?: string;
    iconSize?: string;
    iconColor?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    titleColor?: string;
    descriptionFontSize?: string;
    descriptionLineHeight?: string;
    descriptionColor?: string;
    actionsGap?: string;
    small?: {
        padding?: string;
        iconSize?: string;
        titleFontSize?: string;
        descriptionFontSize?: string;
    };
    large?: {
        padding?: string;
        iconSize?: string;
        titleFontSize?: string;
        descriptionFontSize?: string;
    };
};
export type BadgeSeverityTokens = {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    softBackgroundColor?: string;
    softTextColor?: string;
    softBorderColor?: string;
    outlineTextColor?: string;
    outlineBorderColor?: string;
};
export type BadgeTokens = {
    fontSize?: string;
    lineHeight?: string;
    paddingX?: string;
    paddingY?: string;
    borderRadius?: string;
    gap?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    softBackgroundColor?: string;
    softTextColor?: string;
    softBorderColor?: string;
    outlineTextColor?: string;
    outlineBorderColor?: string;
    info?: BadgeSeverityTokens;
    success?: BadgeSeverityTokens;
    warn?: BadgeSeverityTokens;
    danger?: BadgeSeverityTokens;
    small?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
    large?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
};
type ChipSeverityTokens = {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    softBackgroundColor?: string;
    softTextColor?: string;
    softBorderColor?: string;
    outlineTextColor?: string;
    outlineBorderColor?: string;
};
export type ChipTokens = {
    fontSize?: string;
    lineHeight?: string;
    paddingX?: string;
    paddingY?: string;
    borderRadius?: string;
    gap?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    softBackgroundColor?: string;
    softTextColor?: string;
    softBorderColor?: string;
    outlineTextColor?: string;
    outlineBorderColor?: string;
    iconSize?: string;
    closeSize?: string;
    closeFontSize?: string;
    closeRadius?: string;
    closeColor?: string;
    closeHoverBackgroundColor?: string;
    disabledOpacity?: string;
    info?: ChipSeverityTokens;
    success?: ChipSeverityTokens;
    warn?: ChipSeverityTokens;
    danger?: ChipSeverityTokens;
    small?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
    large?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
};
export type FilterChipsTokens = {
    fontSize?: string;
    gap?: string;
    chipGap?: string;
    chipPadding?: string;
    chipBorderRadius?: string;
    chipBorderColor?: string;
    chipBackgroundColor?: string;
    chipTextColor?: string;
    chipHoverBackgroundColor?: string;
    chipHoverBorderColor?: string;
    chipActiveBackgroundColor?: string;
    chipActiveBorderColor?: string;
    chipActiveTextColor?: string;
    chipSolidActiveBackgroundColor?: string;
    chipSolidActiveBorderColor?: string;
    chipSolidActiveTextColor?: string;
    countPadding?: string;
    countFontSize?: string;
    countBackgroundColor?: string;
    countTextColor?: string;
    countActiveBackgroundColor?: string;
    countActiveTextColor?: string;
    disabledOpacity?: string;
    small?: {
        fontSize?: string;
        chipPadding?: string;
    };
    large?: {
        fontSize?: string;
        chipPadding?: string;
    };
};
export type QueryBuilderTokens = {
    fontSize?: string;
    padding?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    rowGap?: string;
    nestedOffset?: string;
    groupGap?: string;
    groupPadding?: string;
    groupBorderRadius?: string;
    groupBorderColor?: string;
    groupBackgroundColor?: string;
    controlHeight?: string;
    controlBorderRadius?: string;
    controlBorderColor?: string;
    controlBackgroundColor?: string;
    controlFocusBorderColor?: string;
    controlFocusRing?: string;
    dangerTextColor?: string;
    dangerBorderColor?: string;
    disabledOpacity?: string;
};
export type AdvancedFilterPanelTokens = {
    gap?: string;
    padding?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    rowGap?: string;
    labelFontSize?: string;
    controlHeight?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    focusBorderColor?: string;
    focusRing?: string;
    disabledOpacity?: string;
};
export type SavedViewsManagerTokens = {
    gap?: string;
    padding?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    rowGap?: string;
    labelFontSize?: string;
    controlHeight?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    focusBorderColor?: string;
    focusRing?: string;
    dangerTextColor?: string;
    dangerBorderColor?: string;
    disabledOpacity?: string;
};
export type DataTableToolbarTokens = {
    gap?: string;
    padding?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    rowGap?: string;
    labelFontSize?: string;
    controlHeight?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    badgeBackgroundColor?: string;
    badgeTextColor?: string;
    focusBorderColor?: string;
    focusRing?: string;
    disabledOpacity?: string;
};
export type BulkActionBarTokens = {
    gap?: string;
    padding?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    rowGap?: string;
    controlHeight?: string;
    controlBorderColor?: string;
    controlBorderRadius?: string;
    controlBackgroundColor?: string;
    secondaryBorderColor?: string;
    focusBorderColor?: string;
    focusRing?: string;
    disabledOpacity?: string;
};
export type TabMenuTokens = {
    gap?: string;
    borderWidth?: string;
    borderColor?: string;
    tabPadding?: string;
    tabBorderRadius?: string;
    tabTextColor?: string;
    tabHoverTextColor?: string;
    tabHoverBackgroundColor?: string;
    tabActiveTextColor?: string;
    tabActiveBorderColor?: string;
    disabledOpacity?: string;
};
export type WindowTokens = {
    gap?: string;
    padding?: string;
    minHeight?: string;
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    controlsGap?: string;
    controlPadding?: string;
    controlRadius?: string;
    controlBorderColor?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    controlHoverBackgroundColor?: string;
    transitionDuration?: string;
    transitionTiming?: string;
    disabledOpacity?: string;
};
export type SlideGroupTokens = {
    gap?: string;
    controlsGap?: string;
    controlSize?: string;
    controlRadius?: string;
    controlBorderColor?: string;
    controlBackgroundColor?: string;
    controlTextColor?: string;
    controlHoverBackgroundColor?: string;
    itemPadding?: string;
    itemBorderRadius?: string;
    itemBorderColor?: string;
    itemBackgroundColor?: string;
    itemTextColor?: string;
    itemHoverBackgroundColor?: string;
    itemActiveBackgroundColor?: string;
    itemActiveTextColor?: string;
    itemActiveBorderColor?: string;
    disabledOpacity?: string;
};
export type AvatarTokens = {
    size?: string;
    fontSize?: string;
    fontWeight?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    statusSize?: string;
    statusBorderWidth?: string;
    statusBorderColor?: string;
    statusOnlineColor?: string;
    statusOfflineColor?: string;
    statusBusyColor?: string;
    statusAwayColor?: string;
    small?: {
        size?: string;
        fontSize?: string;
        statusSize?: string;
    };
    large?: {
        size?: string;
        fontSize?: string;
        statusSize?: string;
    };
};
export type AvatarGroupTokens = {
    gap?: string;
    overlapOffset?: string;
    ringWidth?: string;
    ringColor?: string;
    overflowBackgroundColor?: string;
    overflowTextColor?: string;
    disabledOpacity?: string;
};
export type ThemeComponentTokens = {
    button?: ButtonTokens;
    buttonGroup?: ButtonGroupTokens;
    card?: CardTokens;
    panel?: PanelTokens;
    fieldset?: FieldsetTokens;
    toolbar?: ToolbarTokens;
    appBar?: AppBarTokens;
    blockui?: BlockUiTokens;
    scrollpanel?: ScrollPanelTokens;
    scrolltop?: ScrollTopTokens;
    picklist?: PickListTokens;
    orderlist?: OrderListTokens;
    chart?: ChartTokens;
    container?: ContainerTokens;
    section?: SectionTokens;
    grid?: GridTokens;
    stack?: StackTokens;
    inline?: InlineTokens;
    checkbox?: CheckboxTokens;
    radio?: RadioTokens;
    tabs?: TabsTokens;
    accordion?: AccordionTokens;
    input?: InputTokens;
    inputGroup?: InputGroupTokens;
    iconField?: IconFieldTokens;
    inputIcon?: InputIconTokens;
    inlineEdit?: InlineEditTokens;
    inplace?: InplaceTokens;
    image?: ImageTokens;
    icon?: IconTokens;
    dock?: DockTokens;
    galleria?: GalleriaTokens;
    knob?: KnobTokens;
    terminal?: TerminalTokens;
    searchInput?: SearchInputTokens;
    mentionInput?: MentionInputTokens;
    passwordInput?: PasswordInputTokens;
    otpInput?: OtpInputTokens;
    colorPicker?: ColorPickerTokens;
    maskedInput?: MaskedInputTokens;
    numberInput?: NumberInputTokens;
    form?: FormTokens;
    formField?: FormFieldTokens;
    floatLabel?: FloatLabelTokens;
    iftaLabel?: IftaLabelTokens;
    textarea?: TextareaTokens;
    richTextEditor?: RichTextEditorTokens;
    fileUpload?: FileUploadTokens;
    link?: LinkTokens;
    breadcrumbs?: BreadcrumbsTokens;
    divider?: DividerTokens;
    pageHeader?: PageHeaderTokens;
    menu?: MenuTokens;
    tieredMenu?: MenuTokens;
    menubar?: MenuBarTokens;
    megamenu?: MegaMenuTokens;
    panelmenu?: PanelMenuTokens;
    modal?: ModalTokens;
    dynamicDialog?: ModalTokens;
    confirmDialog?: ConfirmDialogTokens;
    confirmPopup?: ConfirmPopupTokens;
    drawer?: DrawerTokens;
    sidebar?: DrawerTokens;
    popover?: PopoverTokens;
    overlaypanel?: PopoverTokens;
    dropdown?: DropdownTokens;
    splitbutton?: SplitButtonTokens;
    contextMenu?: ContextMenuTokens;
    commandPalette?: CommandPaletteTokens;
    notificationCenter?: NotificationCenterTokens;
    appShell?: AppShellTokens;
    kanbanBoard?: KanbanBoardTokens;
    navigationRail?: NavigationRailTokens;
    bottomNavigation?: BottomNavigationTokens;
    systemBar?: SystemBarTokens;
    footer?: FooterTokens;
    pageLayout?: PageLayoutTokens;
    mainLayoutRegion?: MainLayoutRegionTokens;
    splitLayout?: SplitLayoutTokens;
    resizableSidebar?: ResizableSidebarTokens;
    stickyRegion?: StickyRegionTokens;
    select?: SelectTokens;
    autocomplete?: AutocompleteTokens;
    combobox?: ComboboxTokens;
    multiselect?: MultiSelectTokens;
    listbox?: ListboxTokens;
    taginput?: TagInputTokens;
    datepicker?: DatePickerTokens;
    calendar?: CalendarTokens;
    daterangepicker?: DateRangePickerTokens;
    timepicker?: TimePickerTokens;
    datetimepicker?: DateTimePickerTokens;
    pagination?: PaginationTokens;
    switch?: SwitchTokens;
    selectionControl?: SelectionControlTokens;
    selectionControlGroup?: SelectionControlGroupTokens;
    segmentedControl?: SegmentedControlTokens;
    themeModeSwitch?: ThemeModeSwitchTokens;
    toggleButton?: ToggleButtonTokens;
    hover?: HoverTokens;
    kbd?: KbdTokens;
    lazy?: LazyTokens;
    parallax?: ParallaxTokens;
    tabMenu?: TabMenuTokens;
    window?: WindowTokens;
    slideGroup?: SlideGroupTokens;
    tooltip?: TooltipTokens;
    tour?: TourTokens;
    skeleton?: SkeletonTokens;
    progress?: ProgressTokens;
    spinner?: SpinnerTokens;
    slider?: SliderTokens;
    splitter?: SplitterTokens;
    stepper?: StepperTokens;
    wizard?: WizardTokens;
    timeline?: TimelineTokens;
    activityFeed?: ActivityFeedTokens;
    auditLogViewer?: AuditLogViewerTokens;
    commentThread?: CommentThreadTokens;
    memberPicker?: MemberPickerTokens;
    permissionMatrix?: PermissionMatrixTokens;
    kpiStatCard?: KpiStatCardTokens;
    meterGroup?: MeterGroupTokens;
    overlayBadge?: OverlayBadgeTokens;
    datatable?: DataTableTokens;
    treetable?: TreeTableTokens;
    dataview?: DataViewTokens;
    carousel?: CarouselTokens;
    speeddial?: SpeedDialTokens;
    toast?: ToastTokens;
    snackbarQueue?: SnackbarQueueTokens;
    banner?: BannerTokens;
    alert?: AlertTokens;
    message?: AlertTokens;
    inlineMessage?: InlineMessageTokens;
    fileManager?: FileManagerTokens;
    jsonViewer?: JsonViewerTokens;
    diffViewer?: DiffViewerTokens;
    codeEditor?: CodeEditorTokens;
    codeBlock?: CodeBlockTokens;
    scheduler?: SchedulerTokens;
    bottomSheet?: BottomSheetTokens;
    sheet?: SheetTokens;
    infiniteScroll?: InfiniteScrollTokens;
    emptyState?: EmptyStateTokens;
    badge?: BadgeTokens;
    chip?: ChipTokens;
    filterChips?: FilterChipsTokens;
    advancedFilterPanel?: AdvancedFilterPanelTokens;
    queryBuilder?: QueryBuilderTokens;
    savedViewsManager?: SavedViewsManagerTokens;
    dataTableToolbar?: DataTableToolbarTokens;
    bulkActionBar?: BulkActionBarTokens;
    avatar?: AvatarTokens;
    avatarGroup?: AvatarGroupTokens;
    rating?: RatingTokens;
    tree?: TreeTokens;
    orgchart?: OrgChartTokens;
    treeselect?: TreeSelectTokens;
    cascadeSelect?: TreeSelectTokens;
    virtualScroller?: VirtualScrollerTokens;
    [key: string]: unknown;
};
export type ThemeTokens = {
    colors?: Record<string, string>;
    colorScheme?: ThemeColorScheme;
    radii?: Record<string, string>;
    typography?: Record<string, string>;
    states?: Record<string, string>;
    controls?: Record<string, string>;
    sizes?: ThemeSizes;
    components?: ThemeComponentTokens;
    [key: string]: unknown;
};
export type ThemePreset = ThemeTokens;
export type ThemeOptions = {
    preset: ThemePreset;
    overrides?: ThemePreset;
    selector?: string;
    darkSelector?: string;
    strict?: boolean;
};

const systemKeys: Array<string> = ['dark', 'light', 'theme', 'preset', 'colors', 'components', 'colorScheme'];

const camelCaseToWords = (string: string) => {
    const result: string = string.replace(/([A-Z])/g, '-$1');

    return result.charAt(0).toUpperCase() + result.slice(1);
};
const breadToRoot = (bread: Array<string>) =>
    bread
        .filter((x: string) => {
            return !systemKeys.includes(x);
        })
        .map((x: string) => {
            return camelCaseToWords(x);
        })
        .join('-')
        .toLowerCase();
const breadToPath = (bread: Array<string>) => bread.join('.');
const isHexColor = (value: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
const normalizeHex = (value: string) => {
    if (!isHexColor(value)) {
        return null;
    }

    if (value.length === 4) {
        const r = value[1];
        const g = value[2];
        const b = value[3];

        return `#${r}${r}${g}${g}${b}${b}`;
    }

    return value.toLowerCase();
};
const hexToRgb = (hex: string): [number, number, number] => {
    const normalized = normalizeHex(hex);

    if (!normalized) {
        return [0, 0, 0];
    }

    const numericValue = parseInt(normalized.slice(1), 16);
    const r = (numericValue >> 16) & 0xff;
    const g = (numericValue >> 8) & 0xff;
    const b = numericValue & 0xff;

    return [r, g, b];
};
const hexToRgbString = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);

    return `${r}, ${g}, ${b}`;
};
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case rNorm:
                h = ((gNorm - bNorm) / delta) % 6;
                break;
            case gNorm:
                h = (bNorm - rNorm) / delta + 2;
                break;
            case bNorm:
                h = (rNorm - gNorm) / delta + 4;
                break;
        }

        h *= 60;

        if (h < 0) {
            h += 360;
        }
    }

    return [h, s * 100, l * 100];
};
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    const sNorm = s / 100;
    const lNorm = l / 100;
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let rPrime = 0;
    let gPrime = 0;
    let bPrime = 0;

    if (h >= 0 && h < 60) {
        rPrime = c;
        gPrime = x;
        bPrime = 0;
    } else if (h >= 60 && h < 120) {
        rPrime = x;
        gPrime = c;
        bPrime = 0;
    } else if (h >= 120 && h < 180) {
        rPrime = 0;
        gPrime = c;
        bPrime = x;
    } else if (h >= 180 && h < 240) {
        rPrime = 0;
        gPrime = x;
        bPrime = c;
    } else if (h >= 240 && h < 300) {
        rPrime = x;
        gPrime = 0;
        bPrime = c;
    } else {
        rPrime = c;
        gPrime = 0;
        bPrime = x;
    }

    const r = Math.round((rPrime + m) * 255);
    const g = Math.round((gPrime + m) * 255);
    const b = Math.round((bPrime + m) * 255);

    return [r, g, b];
};
const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const shadeColor = (hex: string, tone: number) => {
    const normalized = normalizeHex(hex);

    if (!normalized) {
        return hex;
    }

    const [r, g, b] = hexToRgb(normalized);
    const [h, s, l] = rgbToHsl(r, g, b);
    const step = 7;
    const delta = (tone - 5) * step;
    const nextL = clamp(l + delta, 0, 100);
    const [nr, ng, nb] = hslToRgb(h, s, nextL);

    return rgbToHex(nr, ng, nb);
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return !!value && typeof value === 'object' && !Array.isArray(value);
};

export const mergeDeep = (base: ThemePreset, overrides?: ThemePreset): ThemePreset => {
    if (!overrides) {
        return { ...base };
    }

    const result: ThemePreset = { ...base };

    for (const key in overrides) {
        const overrideValue = overrides[key];
        const baseValue = base[key];

        if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
            result[key] = mergeDeep(baseValue, overrideValue);
        } else {
            result[key] = overrideValue;
        }
    }

    return result;
};

export const normalizeThemeOptions = (theme?: ThemeOptions | ThemePreset): ThemeOptions | null => {
    if (!theme) {
        return null;
    }

    if (isPlainObject(theme) && 'preset' in theme) {
        const typed = theme as ThemeOptions;

        return {
            preset: typed.preset ?? {},
            overrides: typed.overrides,
            selector: typed.selector,
            darkSelector: typed.darkSelector,
            strict: typed.strict,
        };
    }

    return { preset: theme as ThemePreset };
};

export const buildThemeVariables = (theme: ThemePreset) => {
    const baseVars: Array<string> = [];
    const darkVars: Array<string> = [];
    const warnings: Array<string> = [];
    const errors: Array<string> = [];
    const warn = (message: string) => warnings.push(message);
    const error = (message: string) => errors.push(message);
    const walk = (node: ThemePreset, trail: Array<string>) => {
        if (!node || typeof node !== 'object') {
            return;
        }

        for (const key in node) {
            const value = node[key];
            const bread = trail.concat([key]);

            if (isPlainObject(value)) {
                walk(value as ThemePreset, bread);

                continue;
            }

            if (value && typeof value === 'object') {
                error(`Theme value "${breadToPath(bread)}" is not a plain object or string and will be ignored.`);

                continue;
            }

            if (typeof value !== 'string') {
                error(`Theme value "${breadToPath(bread)}" is not a string and will be ignored.`);

                continue;
            }

            const isDark = bread.includes('colorScheme') && bread.includes('dark');
            const target = isDark ? darkVars : baseVars;
            const root = breadToRoot(bread);

            target.push(`--vf-${root}: ${value}`);

            if (bread.includes('colors')) {
                const normalized = normalizeHex(value);

                if (!normalized) {
                    warn(
                        `Theme color "${breadToPath(bread)}" is not hex. Shade variables will not be generated for it.`,
                    );

                    continue;
                }

                target.push(`--vf-${root}-rgb: ${hexToRgbString(normalized)}`);

                if (key !== 'white') {
                    for (let i = 1; i < 10; ++i) {
                        const processed = shadeColor(normalized, i);

                        target.push(`--vf-${root}-${i}00: ${processed}`);
                        target.push(`--vf-${root}-${i}00-rgb: ${hexToRgbString(processed)}`);
                    }
                }
            }
        }
    };

    walk(theme, []);

    return { baseVars, darkVars, warnings, errors };
};
