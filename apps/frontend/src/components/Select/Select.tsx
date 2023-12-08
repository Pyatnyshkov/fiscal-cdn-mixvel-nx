import clsx from 'clsx'
import styles from './Select.module.css'

import { InputView } from './const'
import ReactSelect, { GroupBase, OptionsOrGroups } from 'react-select'

interface Select {
  options?: OptionsOrGroups<unknown, GroupBase<unknown>>
  name?: string
  label?: string
  labelDesc?: string
  className?: string
  onChange: any
}

export const Select: React.FC<Select> = ({
  options,
  name,
  label,
  labelDesc,
  onChange,
  className,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={clsx(styles.label)}>
        {label}
        {labelDesc && <span className={styles.labelDesc}>{labelDesc}</span>}
      </div>
      <ReactSelect
        options={options}
        className={styles.input}
        onChange={(value) => onChange(value)}
      />
    </div>
  )
}
