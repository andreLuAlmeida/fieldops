interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-24 w-24 text-3xl',
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return '?'

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return (
    words[0][0] + words[words.length - 1][0]
  ).toUpperCase()
}

export function Avatar({
  name,
  src,
  size = 'md',
}: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center
        justify-center overflow-hidden rounded-full
        bg-primary-soft font-semibold text-primary`}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={`Foto de ${name}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}
