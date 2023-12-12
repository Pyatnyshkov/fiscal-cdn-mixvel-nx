import clsx from 'clsx'
import styles from './Input.module.css'
import { forwardRef, useState } from 'react'
import { InputView } from './const'
import { UseFormRegister } from 'react-hook-form'

interface Input {
  name: string
  label?: string
  labelDesc?: string
  value?: string
  disabled?: boolean
  type?: 'text'
  className?: string
  classNameLabel?: string
  classNameInput?: string
  view?: InputView
  autocomplete?: 'off' | 'on'
  onChange?: (value: string, name: string) => void
  onBlur?: (value: string, name: string) => void
}

export const Input = forwardRef<HTMLInputElement, Input>(
  (
    {
      name,
      label,
      labelDesc,
      value = '',
      disabled,
      type = 'text',
      className,
      classNameLabel,
      classNameInput,
      autocomplete = 'off',
      view,
      onChange = () => {},
      onBlur = () => {},
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>(value)

    // console.log('inputValue', value, inputValue)
    const handleOnChange = (value: string) => {
      // setInputValue(value)
      onChange(value, name)
    }

    const handleOnBlur = (value: string) => {
      // setInputValue(value)
      onBlur(value, name)
    }

    return (
      <div
        className={clsx(styles.root, { [styles.tableCol]: view === InputView.tableCol }, className)}
      >
        {view !== InputView.tableCol && (
          <label htmlFor={name} className={clsx(styles.label, classNameLabel)}>
            {label}
            {labelDesc && <span className={styles.labelDesc}>{labelDesc}</span>}
          </label>
        )}

        <input
          type={type}
          name={name}
          className={clsx(
            styles.input,
            { [styles.disabled]: disabled, [styles.tableColInput]: view === InputView.tableCol },
            classNameInput
          )}
          disabled={disabled}
          autoComplete={autocomplete}
          value={value}
          onChange={(e) => handleOnChange(e.target.value)}
          onBlur={(e) => handleOnBlur(e.target.value)}
          ref={ref}
        />
      </div>
    )
  }
)
