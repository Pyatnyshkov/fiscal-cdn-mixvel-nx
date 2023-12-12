import { Cashier } from './general/cashier.model'
import { ChequeContent } from './general/chequeContent.model'
import { PointOfSettlement } from './general/pointOfSettlement.model'
import { TaxPayer } from './general/taxPayer.model'
import { TaxationSystemModel } from './general/taxationSystem.model'

export interface ChequeModel {
  credit?: ChequeContent
  debit?: ChequeContent
  creditReturn?: ChequeContent
  debitReturn?: ChequeContent
  taxPayer: TaxPayer
  cashier: Cashier
  chequeContent: ChequeContent
  copies: string
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  document: {
    cheque: {
      pointOfSettlement: {
        address: 'г Москва, Шелепихинская наб, д 34 к 3, кв 420'
      }
      cashier: {
        tin: ''
        fullName: 'Борисов Алексей'
      }
      credit: {
        customer: {
          phone: ''
          email: ''
        }
        taxes: {
          vat: [
            {
              amount: 30272.73
              type: {
                $value: 2
                attributes: {
                  codepage: 'fts-1.31_1#vatTaxType'
                }
              }
            }
          ]
        }
        payments: {
          forms: {
            electronic: {
              amount: '333000'
            }
            cash: {
              amount: '0'
            }
            consideration: {
              amount: '0'
            }
          }
          total: {
            amount: '333000'
          }
        }
        settlement: {
          subjects: {
            subject: [
              {
                name: 'Hellblade'
                price: '1000'
                quantity: '333'
                measure: '777'
                taxes: {
                  vat: [
                    {
                      amount: 30272.73
                      type: {
                        $value: '2'
                        attributes: {
                          codepage: 'fts-1.31_1#vatTaxType'
                        }
                      }
                    }
                  ]
                }
                agent: {
                  role: {
                    $value: 4
                    attributes: {
                      codepage: 'fts-1.31_1#agentMode'
                    }
                  }
                }
                supplier: {
                  name: 'Redcat'
                  tin: 'Darkcat'
                }
                signs: {
                  subject: {
                    attributes: {
                      codepage: 'fts-1.31_1#type'
                    }
                    $value: '7'
                  }
                  method: {
                    attributes: {
                      codepage: 'fts-1.31_1#featureOfSettlementMethod'
                    }
                    $value: 4
                  }
                }
                restrictions: {
                  taxationSystems: {
                    taxationSystem: [
                      {
                        type: {
                          $value: '0'
                          attributes: {
                            codepage: 'fts-1.31_1#taxationSystem'
                          }
                        }
                      },
                      {
                        type: {
                          $value: '3'
                          attributes: {
                            codepage: 'fts-1.31_1#taxationSystem'
                          }
                        }
                      }
                    ]
                  }
                }
                amount: '333000.00'
              }
            ]
          }
        }
        taxationSystem: {
          attributes: {
            codepage: 'fts-1.31_1#taxationSystem'
          }
          $value: 0
        }
      }
    }
  }
  pointOfSettlement: PointOfSettlement
  totalAmount: number
  taxationSystem: TaxationSystemModel['type']
  issueResult: Record<string, string>
  issueError: Record<string, string>
  instructions: {
    deviceRouting: Record<string, string>
    responseDelivery: Record<string, string>
  }
  taxation: {
    enabledTaxationSystems: Record<string, string>
  }
  id: number
  sendButtonDisabled: boolean
  sendButtonVisible: boolean
  paymentForm: string
  printoutInjections: {
    documentReferenceNumber: string
    payments: {
      forms: {
        electronic: {
          maskedCardPAN: string
          amount: string
        }
        cash: {
          amount: string
        }
        consideration: {
          amount: string
        }
      }
    }
  }
}
