const LoadingSpinner = ({ label = 'Loading...', size = 'md' }) => {
  const dims =
    size === 'sm'
      ? { w: 'w-6 h-6', border: 'border-[3px]' }
      : size === 'lg'
      ? { w: 'w-12 h-12', border: 'border-4' }
      : { w: 'w-9 h-9', border: 'border-[3.5px]' }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-10 sm:py-14 gap-4"
    >
      <div className="relative">
        <div
          className={
            dims.w +
            ' ' +
            dims.border +
            ' rounded-full border-teal-100 border-t-teal-600 animate-spin'
          }
          style={{ animationDuration: '0.85s' }}
        />
        <div
          className={'absolute inset-0 rounded-full opacity-30 ' + dims.w + ' ' + dims.border + ' border-transparent border-t-teal-400 animate-spin'}
          style={{ animationDuration: '1.4s', animationDirection: 'reverse', position: 'absolute', top: 0, left: 0 }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-[12px] text-slate-400 mt-1">This should only take a moment</p>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default LoadingSpinner
