import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { themeNames } from './theme-names.generated.js'
import type {
  ApiError,
  AvatarParams,
  AvatuneClientConfig,
  FatinVerseParams,
  GenericAvatarParams,
  KyuteParams,
  MicahParams,
  MiniavsParams,
  NevmstasParams,
  PacovqzzParams,
  ThemeName,
  YanliuParams,
} from './types.js'

const DEFAULT_BASE_URL = 'https://www.avatune.dev/api/svg/'
const DEFAULT_TIMEOUT = 10000

/**
 * Error thrown when the API returns an error response
 */
export class AvatuneApiError extends Error {
  public readonly status: number
  public readonly data: ApiError

  constructor(message: string, status: number, data: ApiError) {
    super(message)
    this.name = 'AvatuneApiError'
    this.status = status
    this.data = data
  }

  get isRateLimited(): boolean {
    return this.status === 429
  }

  get retryAfter(): number | undefined {
    return this.data.retryAfter
  }
}

/**
 * Avatune API client for generating avatars
 */
export class AvatuneClient {
  private readonly axios: AxiosInstance
  private readonly baseUrl: string

  constructor(config: AvatuneClientConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL

    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      responseType: 'text',
    })
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(params: AvatarParams | GenericAvatarParams): string {
    const url = new URL(this.baseUrl)

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }

    return url.toString()
  }

  /**
   * Get the URL for an avatar without making a request.
   * Useful for <img> src attributes.
   */
  getAvatarUrl(params: YanliuParams): string
  getAvatarUrl(params: NevmstasParams): string
  getAvatarUrl(params: MiniavsParams): string
  getAvatarUrl(params: MicahParams): string
  getAvatarUrl(params: KyuteParams): string
  getAvatarUrl(params: FatinVerseParams): string
  getAvatarUrl(params: PacovqzzParams): string
  getAvatarUrl(params: GenericAvatarParams): string
  getAvatarUrl(params: AvatarParams | GenericAvatarParams): string {
    return this.buildUrl(params)
  }

  /**
   * Fetch an avatar SVG from the API
   */
  async getAvatar(params: YanliuParams): Promise<string>
  async getAvatar(params: NevmstasParams): Promise<string>
  async getAvatar(params: MiniavsParams): Promise<string>
  async getAvatar(params: MicahParams): Promise<string>
  async getAvatar(params: KyuteParams): Promise<string>
  async getAvatar(params: FatinVerseParams): Promise<string>
  async getAvatar(params: PacovqzzParams): Promise<string>
  async getAvatar(params: GenericAvatarParams): Promise<string>
  async getAvatar(params: AvatarParams | GenericAvatarParams): Promise<string> {
    try {
      const response = await this.axios.get(this.buildUrl(params))
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>
        const status = axiosError.response?.status || 500
        const data = axiosError.response?.data || { error: 'Unknown error' }

        throw new AvatuneApiError(
          data.error || 'API request failed',
          status,
          data,
        )
      }
      throw error
    }
  }

  /**
   * Fetch an avatar as a Blob (useful for downloading or creating object URLs)
   */
  async getAvatarBlob(params: YanliuParams): Promise<Blob>
  async getAvatarBlob(params: NevmstasParams): Promise<Blob>
  async getAvatarBlob(params: MiniavsParams): Promise<Blob>
  async getAvatarBlob(params: MicahParams): Promise<Blob>
  async getAvatarBlob(params: KyuteParams): Promise<Blob>
  async getAvatarBlob(params: FatinVerseParams): Promise<Blob>
  async getAvatarBlob(params: PacovqzzParams): Promise<Blob>
  async getAvatarBlob(params: GenericAvatarParams): Promise<Blob>
  async getAvatarBlob(
    params: AvatarParams | GenericAvatarParams,
  ): Promise<Blob> {
    const svg = await (
      this.getAvatar as (
        p: AvatarParams | GenericAvatarParams,
      ) => Promise<string>
    )(params)
    return new Blob([svg], { type: 'image/svg+xml' })
  }

  /**
   * Get list of available themes
   */
  static get themes(): readonly ThemeName[] {
    return themeNames
  }
}

/**
 * Create a new Avatune API client
 */
export function createClient(config?: AvatuneClientConfig): AvatuneClient {
  return new AvatuneClient(config)
}
