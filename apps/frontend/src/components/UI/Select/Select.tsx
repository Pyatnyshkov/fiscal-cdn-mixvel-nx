import clsx from 'clsx'
import styles from './Select.module.css'

import ReactSelect from 'react-select'
import { SelectOptions } from '@utils/convertToSelectOptions'
import { SelectViewVarinant } from './const'

interface Select {
  options?: SelectOptions
  name?: string
  label?: string
  labelDesc?: string
  className?: string
  classNameLabel?: string
  onChange?: (options: { value: string; label: string } | null) => void
  defaultValue?: string
  placeholder?: string
  isDisabled?: boolean
  view?: SelectViewVarinant
}

export const Select: React.FC<Select> = ({
  options = [],
  name,
  label,
  labelDesc,
  onChange = () => {},
  className,
  classNameLabel,
  defaultValue = '',
  placeholder = '>',
  isDisabled,
  view,
}) => {
  const getOptionNumber = (array: SelectOptions, value: string) =>
    array.findIndex((el) => el.value === value) || 0

  return (
    <div className={clsx(styles.root, className)}>
      {view !== SelectViewVarinant.inTable && (
        <div className={clsx(styles.label, classNameLabel)}>
          {label}
          {labelDesc && <span className={styles.labelDesc}>{labelDesc}</span>}
        </div>
      )}
      <ReactSelect
        options={options}
        className={styles.input}
        defaultValue={options[getOptionNumber(options, defaultValue)]}
        onChange={(value) => onChange(value)}
        classNamePrefix="select"
        placeholder={placeholder}
        isDisabled={isDisabled}
        menuPlacement={view === SelectViewVarinant.inTable ? 'top' : 'bottom'}
        styles={{
          control: (styles, state) => ({
            ...styles,
            borderColor: '#a0bfdf',
            width: view === SelectViewVarinant.inTable ? 'inherit' : '300px',
            height: view === SelectViewVarinant.inTable ? '36px' : '48px',
            borderRadius: view === SelectViewVarinant.inTable ? '0' : '8px',
            borderStyle: view === SelectViewVarinant.inTable ? 'inherit' : 'solid',
            borderWidth: view === SelectViewVarinant.inTable ? '0' : '1px',
            overflow: 'hidden',
            '&:hover': {
              borderColor: 'transperent',
            },
            boxShadow: 'none',
          }),
          option: (styles, state) => ({
            ...styles,
            fontSize: '14px',
            fontWeight: '300',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: state.isSelected ? '#a0bfdf' : 'white',
            color: state.isSelected ? 'black' : 'inherit',
            '&:hover': {
              backgroundColor: !state.isSelected ? '#f1f8ff' : 'transperent',
            },
          }),
          placeholder: (styles, state) => ({
            ...styles,
            fontSize: '14px',
            fontWeight: '300',
          }),
          menu: (styles, state) => ({
            ...styles,
            borderColor: '#a0bfdf',
            boxShadow: '0px 0px 2px #a0bfdf',
            width: view === SelectViewVarinant.inTable ? 'max-content' : '100%',
          }),
          valueContainer: (styles, state) => ({
            ...styles,
            padding: '0 14px',
          }),
          singleValue: (styles, state) => ({
            ...styles,
            fontSize: '14px',
            fontWeight: '300',
          }),
          indicatorsContainer: (styles, state) => ({
            ...styles,
            background: '#a0bfdf',
          }),
          indicatorSeparator: (styles, state) => ({
            ...styles,
            display: 'none',
          }),
          dropdownIndicator: (styles, state) => ({
            ...styles,
            width: view === SelectViewVarinant.inTable ? '10px' : '24px',
            padding: '0',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            '&:hover': {
              color: 'white',
            },
          }),
        }}
      />
    </div>
  )
}
