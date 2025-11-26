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
 * Creates a 'none' item
 */
const createNoneItem = (): AvatarItem => {
  return {
    position: { x: 0, y: 0 },
    layer: 0,
    code: () => '',
    Component: () => null,
  }
}

/**
 * Category-to-identifier mapping
 */
type CategoryIdMap = Record<AvatarPartCategory, string>

/**
 * Default empty ID map
 */
type EmptyIdMap = {
  [K in keyof CategoryIdMap]: never
}

/**
 * Internal builder state with compile-time type tracking
 */
interface BuilderState<T extends AvatarItem> {
  style: ThemeStyle
  items: Partial<Record<AvatarPartCategory, AvatarItemCollection<T>>>
  palettes: Partial<ThemeColorPalettes>
  predictorMappings: ThemePredictorMappings
  connectedColors: ConnectedColors
}

/**
 * Update ID map helper - adds new ID to specific category
 */
type UpdateIdMap<
  IdMap extends CategoryIdMap,
  Category extends keyof CategoryIdMap,
  NewId extends string,
> = {
  [K in keyof IdMap]: K extends Category ? IdMap[K] | NewId : IdMap[K]
}

/**
 * Fluent API builder for creating avatar themes with compile-time type tracking
 */
export interface ThemeBuilder<
  T extends AvatarItem = AvatarItem,
  IdMap extends CategoryIdMap = EmptyIdMap,
> {
  readonly _state: BuilderState<T>

  withStyle(style: Partial<ThemeStyle>): ThemeBuilder<T, IdMap>

  addItem<Category extends keyof CategoryIdMap, Id extends string>(
    category: Category,
    identifier: Id,
    item: BaseAvatarItem,
  ): ThemeBuilder<T, UpdateIdMap<IdMap, Category, Id>>

  setOptional<Category extends keyof CategoryIdMap>(
    category: Category,
  ): ThemeBuilder<T, UpdateIdMap<IdMap, Category, 'none'>>

  addColors(
    category: keyof ThemeColorPalettes,
    color: string[],
  ): ThemeBuilder<T, IdMap>

  withColorPalettes(
    palettes: Partial<ThemeColorPalettes>,
  ): ThemeBuilder<T, IdMap>

  mapPrediction<P extends keyof ThemePredictorMappings>(
    predictor: P,
    predictorValue: string,
    values: string[],
  ): ThemeBuilder<T, IdMap>

  connectColors(
    source: AvatarPartCategory,
    dependents: AvatarPartCategory[],
  ): ThemeBuilder<T, IdMap>

  toFramework<NewT extends AvatarItem>(): ThemeBuilder<NewT, IdMap>

  withComponents(
    category: AvatarPartCategory,
    components: Record<string, Partial<T>>,
  ): ThemeBuilder<T, IdMap>

  build(): {
    style: ThemeStyle
    colorPalettes: ThemeColorPalettes
    predictorMappings: ThemePredictorMappings
    connectedColors: ConnectedColors
  } & {
    [K in keyof IdMap]: Record<IdMap[K] & string, T>
  }
}

const createBuilder = <T extends AvatarItem, IdMap extends CategoryIdMap>(
  state: BuilderState<T>,
): ThemeBuilder<T, IdMap> => {
  const addItem = (
    category: AvatarPartCategory,
    identifier: string,
    item: BaseAvatarItem,
  ): BuilderState<T> => {
    const items = state.items[category] || ({} as AvatarItemCollection<T>)

    return {
      ...state,
      items: {
        ...state.items,
        [category]: {
          ...items,
          [identifier]: item,
        },
      },
    }
  }

  return {
    _state: state,

    withStyle: (style: Partial<ThemeStyle>) =>
      createBuilder({
        ...state,
        style: { ...state.style, ...style },
      }),

    addItem: (
      category: keyof CategoryIdMap,
      identifier: string,
      item: BaseAvatarItem,
    ) => createBuilder(addItem(category, identifier, item)),

    setOptional: (category: keyof CategoryIdMap) => {
      const noneItem = createNoneItem()
      const hasNone = state.items[category]?.none
      if (hasNone) {
        return createBuilder(state)
      }

      return createBuilder(addItem(category, 'none', noneItem))
    },

    addColors: (category: keyof ThemeColorPalettes, colors: string[]) => {
      const palette = state.palettes[category]
      const newPalette = palette ? [...palette, ...colors] : colors

      return createBuilder({
        ...state,
        palettes: {
          ...state.palettes,
          [category]: newPalette,
        },
      })
    },

    withColorPalettes: (palettes: Partial<ThemeColorPalettes>) =>
      createBuilder({
        ...state,
        palettes: { ...state.palettes, ...palettes },
      }),

    mapPrediction: (
      predictor: string,
      predictorValue: string,
      values: string[],
    ) => {
      return createBuilder({
        ...state,
        predictorMappings: {
          ...state.predictorMappings,
          [predictor]: {
            ...(state.predictorMappings[
              predictor as keyof ThemePredictorMappings
            ] as Record<string, string[]>),
            [predictorValue]: values,
          },
        },
      })
    },

    connectColors: (
      source: AvatarPartCategory,
      dependents: AvatarPartCategory[],
    ) => {
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

    withComponents: (
      category: AvatarPartCategory,
      components: Record<string, Partial<T>>,
    ) => {
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
      const categoryEntries = (
        Object.keys(state.items) as AvatarPartCategory[]
      ).map((category) => [
        category,
        (state.items[category] || {}) as Record<
          IdMap[typeof category] & string,
          T
        >,
      ])

      return {
        style: state.style,
        colorPalettes: state.palettes as ThemeColorPalettes,
        predictorMappings: state.predictorMappings,
        connectedColors: state.connectedColors,
        ...Object.fromEntries(categoryEntries),
      } as {
        style: ThemeStyle
        colorPalettes: ThemeColorPalettes
        predictorMappings: ThemePredictorMappings
        connectedColors: ConnectedColors
      } & {
        [K in keyof IdMap]: Record<IdMap[K] & string, T>
      }
    },
  }
}

export const createTheme = <T extends AvatarItem = AvatarItem>(): ThemeBuilder<
  T,
  EmptyIdMap
> =>
  createBuilder<T, EmptyIdMap>({
    style: { size: 200 },
    items: {},
    palettes: {},
    predictorMappings: {},
    connectedColors: {},
  })
