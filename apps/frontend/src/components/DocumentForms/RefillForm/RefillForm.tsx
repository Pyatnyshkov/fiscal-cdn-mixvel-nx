import { useAppDispatch, useAppSelector } from '@store'
import { Button } from '../../UI/Button'
import { Input } from '../../UI/Input'

import styles from './RefillForm.module.css'
import { selectRefillRequest } from '@store/refill/selectors'
import { fetchRefill, refillSlice } from '@store/refill'

export const RefillForm = () => {
  const refillRequest = useAppSelector(selectRefillRequest)

  const dispatch = useAppDispatch()

  const onChange = (value: string, name: string) => {
    const copyRefillRequest = { ...refillRequest }
    //@ts-ignore
    copyRefillRequest[name] = value

    dispatch(refillSlice.actions.updateRefill(copyRefillRequest))
  }

  const onSubmit = () => {
    dispatch(fetchRefill)
  }

  return (
    <div className={styles.root}>
      <div className={styles.col}>
        <Input
          value={refillRequest.amount}
          name="amount"
          label="Сумма поступления"
          className={styles.marginBottom}
          onChange={(value, name) => onChange(value, name)}
        />
        <Input
          value={refillRequest.operatorName}
          name="operatorName"
          label="ФИО оператора"
          onChange={(value, name) => onChange(value, name)}
        />
      </div>
      <Button text="Пополнить" className={styles.marginLeft} onClick={onSubmit} />
    </div>
  )
}
