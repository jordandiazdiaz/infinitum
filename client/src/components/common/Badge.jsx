const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'badge badge-gray',
    primary: 'badge badge-primary',
    success: 'badge badge-success',
    danger: 'badge badge-danger',
    warning: 'badge badge-warning',
    info: 'badge badge-info'
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  }

  return (
    <span className={`${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export default Badge
