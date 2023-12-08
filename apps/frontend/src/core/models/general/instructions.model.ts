export interface Instructions {
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
  responseDelivery: {
    socketio: {
      client: {
        guid: string
        zoneId: string
      }
    }
  }
}
