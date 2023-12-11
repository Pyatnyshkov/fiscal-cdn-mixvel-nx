import clsx from 'clsx'
import styles from './Select.module.css'

import ReactSelect from 'react-select'
import { SelectOptions } from '@utils/convertToSelectOptions'

interface Select {
  options?: SelectOptions
  name?: string
  label?: string
  labelDesc?: string
  className?: string
  onChange: (options: { value: string; label: string } | null) => void
  defaultValue?: string
}

export const Select: React.FC<Select> = ({
  options = [],
  name,
  label,
  labelDesc,
  onChange = () => {},
  className,
  defaultValue = '',
}) => {
  const getOptionNumber = (array: SelectOptions, value: string) =>
    array.findIndex((el) => el.value === value) || 0

  return (
    <div className={clsx(styles.root, className)}>
      <div className={clsx(styles.label)}>
        {label}
        {labelDesc && <span className={styles.labelDesc}>{labelDesc}</span>}
      </div>
      <ReactSelect
        options={options}
        className={styles.input}
        defaultValue={options[getOptionNumber(options, defaultValue)]}
        onChange={(value) => onChange(value)}
        classNamePrefix="select"
        styles={{
          control: (styles, state) => ({
            ...styles,
            borderColor: '#a0bfdf',
          }),
          indicatorsContainer: (styles, state) => ({
            ...styles,
            width: '50px',
          }),
          indicatorSeparator: (styles, state) => ({
            ...styles,
            width: '40px',
          }),
        }}
      />
    </div>
  )
}
