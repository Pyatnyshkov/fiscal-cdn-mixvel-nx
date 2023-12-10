import clsx from 'clsx'
import styles from './Checkbox.module.css'

interface Checkbox {
  name: string
  label: string
  id: string
  checked: boolean
  className?: string
  onChange?: (value: any, checked: boolean) => void
}

export const Checkbox: React.FC<Checkbox> = ({
  name,
  label,
  checked,
  onChange = () => {},
  className,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        onChange={(e) => onChange(name, e.target.checked)}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}
