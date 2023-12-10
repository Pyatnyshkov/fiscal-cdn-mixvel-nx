export interface TokenEditor {
  attributes: {
    id: string
  }
  taxPayer?: {
    tin: string
    name: string
  }
  instructions?: {
    deviceRouting: {
      cashRegistersService: {
        messagingBroker: {
          url: string
          amqp: {
            exchange: 'devices'
          }
        }
        cashRegister: {
          serialNumber: string
          vendor: 'AQSI'
        }
      }
    }
    responseDelivery?: {
      socketio: {
        client: {
          guid: string
          zoneId: string
        }
      }
    }
  }
  document?: {
    cheque?: {
      cashier: {
        tin: string
        fullName: string
      }
      pointOfSettlement: {
        address: string
      }
      credit: {
        customer: {
          phone: string
          email: string
        }
        taxes: {
          vat: unknown[]
        }
        payments: {
          forms: {
            electronic: {
              amount: string
            }
            cash: {
              amount: string
            }
            consideration: {
              amount: string
            }
          }
          total: {
            amount: string
          }
        }
        settlement: {
          subjects: {
            subject: unknown[]
          }
        }
        taxationSystem: {
          attributes: {
            codepage: string
          }
          $value: number
        }
      }
    }
  }
}
