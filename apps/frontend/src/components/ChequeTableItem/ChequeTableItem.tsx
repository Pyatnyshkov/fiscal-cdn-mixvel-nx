import ReactSelect from 'react-select'
import { Input, InputView } from '../Input'

import styles from './ChequeTableItem.module.css'
import { SelectOptions, convertToSelectOptions } from '../../utils/convertToSelectOptions'
import { MethodOptions, SubjectOptions, TaxesOptions } from './const'
import { ChequeItem } from '@models/chequeItem.model.'
import { SignsSubjectOptions } from '@consts/signsSubject.const'
import { SignsMethodOptions } from '@consts/signsMethod.const'
import { AgentRoleOptions } from '@consts/agentRole'
import { selectChequeGetItemById } from '@store/chequeItems/selectors'
import { useAppDispatch, useAppSelector } from '@store'
import { EntityId } from '@reduxjs/toolkit'
import { calcVatAmount } from '@utils/calcTaxes'
import { chequeItemsSlice } from '@store/chequeItems'

interface TableItem {
  id: EntityId
  index: number
  onClick: (id: string) => void
  className?: string
}

export const ChequeTableItem: React.FC<TableItem> = ({ id, index, onClick, className }) => {
  const chequeItem = useAppSelector(selectChequeGetItemById(id))

  if (!chequeItem) {
    return
  }

  const taxesOptions = convertToSelectOptions(TaxesOptions)
  const signsSubjectOptions = convertToSelectOptions(SignsSubjectOptions)
  const signsMethodOptions = convertToSelectOptions(SignsMethodOptions)
  const agentRoleOptions = convertToSelectOptions(AgentRoleOptions)

  const dispatch = useAppDispatch()

  const getOptionNumber = (array: SelectOptions, value: string) =>
    array.findIndex((el) => el.value === value) || 0

  const taxesOptionsDefaultIndex = getOptionNumber(taxesOptions, chequeItem.taxes)
  const signsSubjectOptionsDefaultIndex = getOptionNumber(
    signsSubjectOptions,
    chequeItem.signsSubject
  )
  const signsMethodOptionsDefaultIndex = 3
  const agentRoleOptionsDefaultIndex = getOptionNumber(agentRoleOptions, chequeItem.agentRole)

  const getAmount = (price: string, quantity: string) => {
    return (parseFloat(price) * parseFloat(quantity)).toString()
  }

  const amount = getAmount(chequeItem.price, chequeItem.quantity)
  const taxesAmount = calcVatAmount(chequeItem.taxes, amount).amount

  const handleChange = (value: string, name: string) => {
    const copyChequeItem = { ...chequeItem }
    // if (name === 'price') {
    //   console.log('value', value)
    //   copyChequeItem.amount = getAmount(value, copyChequeItem.quantity)
    // }

    //@ts-ignore
    copyChequeItem[name] = value
    dispatch(chequeItemsSlice.actions.updateItem({ id: chequeItem.id, changes: copyChequeItem }))
  }

  return (
    <tr className={styles.root}>
      <td>{`${index + 1}`}</td>
      <td>
        <Input
          name="name"
          value={chequeItem.name}
          onChange={(value, name) => handleChange(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="price"
          value={chequeItem.price}
          onChange={(value, name) => handleChange(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="quantity"
          value={chequeItem.quantity}
          onChange={(value, name) => handleChange(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="amount"
          value={amount}
          onChange={(value, name) => handleChange(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="measure"
          value={chequeItem.measure}
          onChange={(value, name) => handleChange(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <ReactSelect
          options={taxesOptions}
          defaultValue={taxesOptions[taxesOptionsDefaultIndex]}
          onChange={(option) => handleChange(option?.value || '', 'taxes')}
        />
      </td>
      <td>
        <Input name="taxesAmount" value={taxesAmount} view={InputView.tableCol} disabled />
      </td>
      <td>
        <ReactSelect />
      </td>
      <td>
        <ReactSelect
          options={signsSubjectOptions}
          defaultValue={signsSubjectOptions[signsSubjectOptionsDefaultIndex]}
        />
      </td>
      <td>
        <ReactSelect
          options={signsMethodOptions}
          defaultValue={signsMethodOptions[signsMethodOptionsDefaultIndex]}
        />
      </td>
      <td>
        <ReactSelect
          options={agentRoleOptions}
          defaultValue={agentRoleOptions[agentRoleOptionsDefaultIndex]}
          isDisabled
        />
      </td>
      <td>
        <Input
          name="supplierTin"
          value={chequeItem.supplierTin}
          onChange={(value, name) => handleChange(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="supplierName"
          value={chequeItem.supplierName}
          onChange={(value, name) => handleChange(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <button
          type="button"
          className={styles.buttonRemoveRow}
          onClick={() => onClick(chequeItem.id)}
        />
      </td>
    </tr>
  )
}
