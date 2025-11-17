import type {
  AvatarItem,
  AvatarItemCollection,
  AvatarPartCategory,
  BaseAvatarItem,
  ConnectedColors,
  ThemeColorPalettes,
  ThemePredictorMappings,
  ThemeStyle,
} from '@avatune/types'

/**
 * Internal builder state with compile-time type tracking
 */
interface BuilderState<T extends AvatarItem> {
  themeStyle: ThemeStyle
  items: Partial<Record<AvatarPartCategory, AvatarItemCollection<T>>>
  palettes: Partial<ThemeColorPalettes>
  predictorMappings: ThemePredictorMappings
  connectedColors: ConnectedColors
}

/**
 * Fluent API builder for creating avatar themes with compile-time type tracking
 */
export interface ThemeBuilder<
  T extends AvatarItem = AvatarItem,
  GlassesIds extends string = never,
  HatsIds extends string = never,
  HairIds extends string = never,
  FaceDetailsIds extends string = never,
  BodyIds extends string = never,
  EarsIds extends string = never,
  EyebrowsIds extends string = never,
  EyesIds extends string = never,
  FaceHairIds extends string = never,
  ForelockIds extends string = never,
  HeadIds extends string = never,
  MouthIds extends string = never,
  NeckIds extends string = never,
  NosesIds extends string = never,
> {
  readonly _state: BuilderState<T>

  withStyle(
    style: Partial<ThemeStyle>,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  addItem<Id extends string>(
    category: 'glasses',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds | Id,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'hats',
    identifier: Id,
    config: BaseAvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds | Id,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'hair',
    identifier: Id,
    config: BaseAvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds | Id,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'faceDetails',
    identifier: Id,
    config: BaseAvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds | Id,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'body',
    identifier: Id,
    config: BaseAvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds | Id,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'ears',
    identifier: Id,
    config: BaseAvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds | Id,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'eyebrows',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds | Id,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'eyes',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds | Id,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'faceHair',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds | Id,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'forelock',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds | Id,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'head',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds | Id,
    MouthIds,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'mouth',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds | Id,
    NeckIds,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'neck',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds | Id,
    NosesIds
  >
  addItem<Id extends string>(
    category: 'noses',
    identifier: Id,
    config: AvatarItem,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds | Id
  >

  addColor(
    category: keyof ThemeColorPalettes,
    color: string,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  withColorPalette(
    category: keyof ThemeColorPalettes,
    colors: string | string[],
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  withColorPalettes(
    palettes: Partial<ThemeColorPalettes>,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  mapPrediction(
    predictor: 'hair',
    predictorValue: string,
    identifiers: string[],
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >
  mapPrediction(
    predictor: 'hairColor' | 'skinTone',
    predictorValue: string,
    colors: string[],
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  connectColors(
    source: AvatarPartCategory,
    dependents: AvatarPartCategory[],
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  toFramework<NewT extends AvatarItem>(): ThemeBuilder<
    NewT,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  withComponents(
    category: AvatarPartCategory,
    components: Record<string, Partial<T>>,
  ): ThemeBuilder<
    T,
    GlassesIds,
    HatsIds,
    HairIds,
    FaceDetailsIds,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    FaceHairIds,
    ForelockIds,
    HeadIds,
    MouthIds,
    NeckIds,
    NosesIds
  >

  build(): {
    style: ThemeStyle
    glasses: Record<GlassesIds, T>
    hats: Record<HatsIds, T>
    hair: Record<HairIds, T>
    faceDetails: Record<FaceDetailsIds, T>
    body: Record<BodyIds, T>
    ears: Record<EarsIds, T>
    eyebrows: Record<EyebrowsIds, T>
    eyes: Record<EyesIds, T>
    faceHair: Record<FaceHairIds, T>
    forelock: Record<ForelockIds, T>
    head: Record<HeadIds, T>
    mouth: Record<MouthIds, T>
    neck: Record<NeckIds, T>
    noses: Record<NosesIds, T>
    colorPalettes: ThemeColorPalettes
    predictorMappings: ThemePredictorMappings
    connectedColors: ConnectedColors
  }
}

// Pure functional implementation
const createBuilder = <
  T extends AvatarItem,
  GlassesIds extends string = never,
  HatsIds extends string = never,
  HairIds extends string = never,
  FaceDetailsIds extends string = never,
  BodyIds extends string = never,
  EarsIds extends string = never,
  EyebrowsIds extends string = never,
  EyesIds extends string = never,
  FaceHairIds extends string = never,
  ForelockIds extends string = never,
  HeadIds extends string = never,
  MouthIds extends string = never,
  NeckIds extends string = never,
  NosesIds extends string = never,
>(
  state: BuilderState<T>,
): ThemeBuilder<
  T,
  GlassesIds,
  HatsIds,
  HairIds,
  FaceDetailsIds,
  BodyIds,
  EarsIds,
  EyebrowsIds,
  EyesIds,
  FaceHairIds,
  ForelockIds,
  HeadIds,
  MouthIds,
  NeckIds,
  NosesIds
> => {
  const addItem = (
    category: AvatarPartCategory,
    identifier: string,
    config: AvatarItem,
  ): BuilderState<T> => {
    const items = state.items[category] || ({} as AvatarItemCollection<T>)
    const layer = config.layer ?? 1

    return {
      ...state,
      items: {
        ...state.items,
        [category]: {
          ...items,
          [identifier]: {
            position: config.position,
            layer,
            color: config.color,
          } as T,
        },
      },
    }
  }

  return {
    _state: state,

    withStyle: (style) =>
      createBuilder({
        ...state,
        themeStyle: { ...state.themeStyle, ...style },
      }),

    addItem: (category, identifier, config) =>
      createBuilder(addItem(category, identifier, config)),

    addColor: (category, color) => {
      const palette = state.palettes[category]
      const newPalette = Array.isArray(palette)
        ? [...palette, color]
        : palette
          ? [palette, color]
          : [color]

      return createBuilder({
        ...state,
        palettes: {
          ...state.palettes,
          [category]: newPalette,
        },
      })
    },

    withColorPalette: (category, colors) =>
      createBuilder({
        ...state,
        palettes: {
          ...state.palettes,
          [category]: colors,
        },
      }),

    withColorPalettes: (palettes) =>
      createBuilder({
        ...state,
        palettes: { ...state.palettes, ...palettes },
      }),

    mapPrediction: (predictor, predictorValue, values) => {
      return createBuilder({
        ...state,
        predictorMappings: {
          ...state.predictorMappings,
          [predictor]: {
            ...state.predictorMappings[predictor],
            [predictorValue]: values,
          },
        },
      })
    },

    connectColors: (source, dependents) => {
      if (dependents.length === 0) {
        return createBuilder(state)
      }

      const newConnections: ConnectedColors = {}

      for (const dep of dependents) {
        newConnections[dep] = source
      }

      return createBuilder({
        ...state,
        connectedColors: {
          ...state.connectedColors,
          ...newConnections,
        },
      })
    },

    toFramework: () => createBuilder(state) as never,

    withComponents: (category, components) => {
      const categoryItems = state.items[category]
      if (!categoryItems) {
        throw new Error(
          `Theme builder: cannot add components to non-existent category '${category}'`,
        )
      }

      const updatedItems: AvatarItemCollection<T> =
        {} as AvatarItemCollection<T>

      for (const [identifier, item] of Object.entries(categoryItems)) {
        if (components[identifier]) {
          updatedItems[identifier] = {
            ...item,
            ...components[identifier],
          } as T
        } else {
          updatedItems[identifier] = item
        }
      }

      for (const identifier of Object.keys(components)) {
        if (!categoryItems[identifier]) {
          throw new Error(
            `Theme builder: cannot add components to non-existent item '${identifier}' in category '${category}'`,
          )
        }
      }

      return createBuilder({
        ...state,
        items: {
          ...state.items,
          [category]: updatedItems,
        },
      })
    },

    build: () => {
      return {
        style: state.themeStyle,
        glasses: state.items.glasses as Record<GlassesIds, T>,
        hats: state.items.hats as Record<HatsIds, T>,
        hair: state.items.hair as Record<HairIds, T>,
        faceDetails: state.items.faceDetails as Record<FaceDetailsIds, T>,
        body: state.items.body as Record<BodyIds, T>,
        ears: state.items.ears as Record<EarsIds, T>,
        eyebrows: state.items.eyebrows as Record<EyebrowsIds, T>,
        eyes: state.items.eyes as Record<EyesIds, T>,
        faceHair: state.items.faceHair as Record<FaceHairIds, T>,
        forelock: state.items.forelock as Record<ForelockIds, T>,
        head: state.items.head as Record<HeadIds, T>,
        mouth: state.items.mouth as Record<MouthIds, T>,
        neck: state.items.neck as Record<NeckIds, T>,
        noses: state.items.noses as Record<NosesIds, T>,
        colorPalettes: state.palettes as ThemeColorPalettes,
        predictorMappings: state.predictorMappings,
        connectedColors: state.connectedColors,
      }
    },
  }
}

/**
 * Create a new theme builder
 */
export const createTheme = <
  T extends AvatarItem = AvatarItem,
>(): ThemeBuilder<T> =>
  createBuilder<T>({
    themeStyle: { size: 200 },
    items: {},
    palettes: {},
    predictorMappings: {},
    connectedColors: {},
  })
