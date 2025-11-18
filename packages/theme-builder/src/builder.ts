import type {
  AvatarItem,
  AvatarItemCollection,
  AvatarPartCategory,
  ConnectedColors,
  Position,
  ThemeColorPalettes,
  ThemePredictorMappings,
  ThemeStyle,
} from '@avatune/types'

interface ItemConfig {
  position: Position
  layer?: number
  color?: string
}

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
  BodyIds extends string = never,
  EarsIds extends string = never,
  EyebrowsIds extends string = never,
  EyesIds extends string = never,
  HairIds extends string = never,
  HeadIds extends string = never,
  MouthIds extends string = never,
  NosesIds extends string = never,
  FaceHairIds extends string = never,
  FaceDetailsIds extends string = never,
  GlassesIds extends string = never,
> {
  readonly _state: BuilderState<T>

  withStyle(
    style: Partial<ThemeStyle>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  addItem<Id extends string>(
    category: 'body',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds | Id,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'ears',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds | Id,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'eyebrows',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds | Id,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'eyes',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds | Id,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'hair',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds | Id,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'head',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds | Id,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'mouth',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds | Id,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'noses',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds | Id,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'faceHair',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds | Id,
    FaceDetailsIds,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'faceDetails',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds | Id,
    GlassesIds
  >
  addItem<Id extends string>(
    category: 'glasses',
    identifier: Id,
    config: ItemConfig,
    itemSpecific?: Partial<T>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds | Id
  >

  addColor(
    category: keyof ThemeColorPalettes,
    color: string,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  withColorPalette(
    category: keyof ThemeColorPalettes,
    colors: string | string[],
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  withColorPalettes(
    palettes: Partial<ThemeColorPalettes>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  mapPrediction(
    predictor: 'hair',
    predictorValue: string,
    identifiers: string[],
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >
  mapPrediction(
    predictor: 'hairColor' | 'skinTone',
    predictorValue: string,
    colors: string[],
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  connectColors(
    source: AvatarPartCategory,
    dependents: AvatarPartCategory[],
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  toFramework<NewT extends AvatarItem>(): ThemeBuilder<
    NewT,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  withComponents(
    category: AvatarPartCategory,
    components: Record<string, Partial<T>>,
  ): ThemeBuilder<
    T,
    BodyIds,
    EarsIds,
    EyebrowsIds,
    EyesIds,
    HairIds,
    HeadIds,
    MouthIds,
    NosesIds,
    FaceHairIds,
    FaceDetailsIds,
    GlassesIds
  >

  build(): {
    style: ThemeStyle
    body: Record<BodyIds, T>
    ears: Record<EarsIds, T>
    eyebrows: Record<EyebrowsIds, T>
    eyes: Record<EyesIds, T>
    hair: Record<HairIds, T>
    head: Record<HeadIds, T>
    mouth: Record<MouthIds, T>
    noses: Record<NosesIds, T>
    faceHair: Record<FaceHairIds, T>
    faceDetails: Record<FaceDetailsIds, T>
    glasses: Record<GlassesIds, T>
    colorPalettes: ThemeColorPalettes
    predictorMappings: ThemePredictorMappings
    connectedColors: ConnectedColors
  }
}

const createBuilder = <
  T extends AvatarItem,
  BodyIds extends string = never,
  EarsIds extends string = never,
  EyebrowsIds extends string = never,
  EyesIds extends string = never,
  HairIds extends string = never,
  HeadIds extends string = never,
  MouthIds extends string = never,
  NosesIds extends string = never,
  FaceHairIds extends string = never,
  FaceDetailsIds extends string = never,
  GlassesIds extends string = never,
>(
  state: BuilderState<T>,
): ThemeBuilder<
  T,
  BodyIds,
  EarsIds,
  EyebrowsIds,
  EyesIds,
  HairIds,
  HeadIds,
  MouthIds,
  NosesIds,
  FaceHairIds,
  FaceDetailsIds,
  GlassesIds
> => {
  const addItem = (
    category: AvatarPartCategory,
    identifier: string,
    config: ItemConfig,
    itemSpecific: Partial<T> = {},
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
            ...itemSpecific,
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

    addItem: (category, identifier, config, itemSpecific = {}) =>
      createBuilder(addItem(category, identifier, config, itemSpecific)) as any,

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
        body: state.items.body as Record<BodyIds, T>,
        ears: state.items.ears as Record<EarsIds, T>,
        eyebrows: state.items.eyebrows as Record<EyebrowsIds, T>,
        eyes: state.items.eyes as Record<EyesIds, T>,
        hair: state.items.hair as Record<HairIds, T>,
        head: state.items.head as Record<HeadIds, T>,
        mouth: state.items.mouth as Record<MouthIds, T>,
        noses: state.items.noses as Record<NosesIds, T>,
        faceHair: state.items.faceHair as Record<FaceHairIds, T>,
        faceDetails: state.items.faceDetails as Record<FaceDetailsIds, T>,
        glasses: state.items.glasses as Record<GlassesIds, T>,
        colorPalettes: state.palettes as ThemeColorPalettes,
        predictorMappings: state.predictorMappings,
        connectedColors: state.connectedColors,
      }
    },
  }
}

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
