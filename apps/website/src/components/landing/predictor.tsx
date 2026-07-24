import { PredictionPipelineLoader } from '../client/prediction-pipeline-loader'

export function Predictor() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-8 py-24">
        <div className="mb-16 grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2.5 font-code text-[11px] tracking-[0.18em] uppercase text-ink-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-mark shadow-[0_0_0_3px_rgba(25,179,133,0.18)]" />
              Experimental · Predictor
            </div>
            <h2 className="mt-[18px] font-display text-[clamp(38px,4.6vw,64px)] leading-[1.02] font-[380] tracking-[-0.028em] [&_.soft]:text-ink-3">
              Draft an avatar
              <br />
              from a <span className="soft">real photo.</span>
            </h2>
          </div>
          <p className="max-w-[56ch] font-body text-[18px] leading-[1.55] text-ink-2">
            A small on-device model reads skin tone, hair length, hair color,
            and facial hair, then seeds a themed avatar. Edit the inferred parts
            inline, or accept and ship.
          </p>
        </div>

        <PredictionPipelineLoader />
      </div>
    </section>
  )
}
