export interface RefillOperation {
  request: {
    amount: string // полгоаю тоже из инпута
    operatorName: string //из инпута <input id="encashmentOperatorName" class="changeable" data-key="request.operatorName"> (не обязательно)</p>
  }
  response: {
    amountBefore: number
    amountAfter: number //эти оба из ответа SOAP encashment
  }
}
