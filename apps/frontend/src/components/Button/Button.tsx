import clsx from 'clsx'
import styles from './Button.module.css'

interface Button {
  text: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const Button: React.FC<Button> = ({ text, disabled, onClick, className }) => {
  return (
    <button
      type="button"
      className={clsx(styles.root, { [styles.disabled]: disabled }, className)}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
