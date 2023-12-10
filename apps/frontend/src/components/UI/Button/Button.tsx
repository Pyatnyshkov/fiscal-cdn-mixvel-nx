import clsx from 'clsx'
import styles from './Button.module.css'

interface Button {
  text: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const Button: React.FC<Button> = ({
  text,
  type = 'button',
  disabled,
  onClick,
  className,
}) => {
  return (
    <button
      type={type}
      className={clsx(styles.root, { [styles.disabled]: disabled }, className)}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
