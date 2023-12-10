import clsx from 'clsx'
import styles from './Checkbox.module.css'

interface Checkbox {
  name: string
  label: string
  id: string
  checked: boolean
  className?: string
  onChange?: (value: string) => void
}

export const Checkbox: React.FC<Checkbox> = ({
  name,
  label,
  checked,
  onChange = (name: string) => {},
  className,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        onChange={(e) => console.log(e.target.checked, name)}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}
