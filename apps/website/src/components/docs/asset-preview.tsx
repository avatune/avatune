import Image from 'next/image'

type SvgFactory = (props?: { color?: string }) => string

export interface AssetPreviewProps {
  svg: string | SvgFactory
  title: string
  size?: number
  hideCaption?: boolean
}

export function AssetPreview({
  svg,
  title,
  hideCaption = false,
}: AssetPreviewProps) {
  const resolvedSvg =
    typeof svg === 'function' ? svg({ color: '#1b0b47' }) : svg

  return (
    <figure
      className="inline-flex flex-col items-center gap-2"
      aria-label={title}
    >
      <div className="h-[150px] w-[150px] rounded-xl bg-[radial-gradient(circle_at_top,#f7fafc,#e2e8f0)] p-2 shadow-[inset_0_1px_2px_rgba(15,23,42,0.12)]">
        <Image
          className="block h-full w-full"
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(resolvedSvg)}`}
          alt=""
          width={150}
          height={150}
          unoptimized
        />
      </div>
      {!hideCaption && (
        <figcaption className="text-xs capitalize">{title}</figcaption>
      )}
    </figure>
  )
}
