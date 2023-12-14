import clsx from 'clsx'
import styles from './Input.module.css'
import { forwardRef, useEffect, useState } from 'react'
import { InputView } from './const'
import { useDebouncedCallback } from 'use-debounce'

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
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>(value)
    const debouncedChangeValue = useDebouncedCallback(onChange, 1000)

    useEffect(() => {
      setInputValue(value)
    }, [value])

    const handleOnChange = (value: string) => {
      setInputValue(value)
      debouncedChangeValue(value, name)
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
          value={inputValue}
          onChange={(e) => handleOnChange(e.target.value)}
          ref={ref}
        />
      </div>
    )
  }
)
