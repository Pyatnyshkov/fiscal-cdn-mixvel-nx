import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../../UI/Button'
import { Input } from '../../UI/Input'

import styles from './EncashmentForm.module.css'
import { useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@store'
import { selectEncashmentRequest } from '@store/encashment/selectors'
import { selectHideOnShiftOperation } from '@store/document/selectors'
import { encashmentSlice, fetchEncashment } from '@store/encashment'

interface IFormInput {
  firstName: string
  lastName: string
  iceCreamType: { label: string; value: string }
}

export const EncashmentForm = () => {
  const encashmentRequest = useAppSelector(selectEncashmentRequest)
  const hideOnShiftOperation = useAppSelector(selectHideOnShiftOperation)
  const dispatch = useAppDispatch()

  const onChange = (value: string, name: string) => {
    const copyEncashmentRequest = { ...encashmentRequest }
    //@ts-ignore
    copyEncashmentRequest[name] = value

    dispatch(encashmentSlice.actions.updateEncashment(copyEncashmentRequest))
  }

  const onSubmit = () => {
    dispatch(fetchEncashment)
  }

  return (
    <div className={styles.root}>
      <div className={styles.col}>
        <Input
          value={encashmentRequest.amount}
          name="amount"
          label="Сумма инкассации"
          className={styles.marginBottom}
          onChange={(value, name) => onChange(value, name)}
        />
        <Input
          value={encashmentRequest.operatorName}
          name="operatorName"
          label="ФИО оператора"
          onChange={(value, name) => onChange(value, name)}
        />
      </div>
      <Button 
        text="Инкассация" 
        className={styles.marginLeft} 
        onClick={onSubmit}
        disabled={hideOnShiftOperation}
      />
    </div>
  )
}
