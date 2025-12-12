interface StepHeaderProps {
  title: string
  description?: string
}

const StepHeader = ({ title, description }: StepHeaderProps) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      {description && <p className="text-slate-300 mb-8">{description}</p>}
    </>
  )
}

export default StepHeader
