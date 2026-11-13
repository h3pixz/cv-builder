export function FormError({ message }: { message?: string | null }) {
  if (!message) {
    return null
  }

  return (
    <p role="alert" className="pt-2 text-center text-xs text-error">
      {message}
    </p>
  )
}
