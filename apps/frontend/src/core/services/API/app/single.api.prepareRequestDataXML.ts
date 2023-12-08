import { Instructions } from '@models/general/instructions.model'
import moment from 'moment'

type DeviceRouting = Instructions['deviceRouting']

export const singlePrepareRequestDataXML = (deviceRouting: DeviceRouting): string => {
  const bodyTemplate =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://sirena-travel.ru">\n' +
    '  <soapenv:Header />\n' +
    '  <soapenv:Body>\n' +
    '    <sir:deviceRouteStatus id="$id$">\n' +
    '      <cashRegistersService>\n' +
    '        <messagingBroker>\n' +
    '          <url>$AMQP_URL$</url>\n' +
    '          <amqp>\n' +
    '            <exchange>$AMQP_EXCHANGE$</exchange>\n' +
    '          </amqp>\n' +
    '        </messagingBroker>\n' +
    '        <cashRegister>\n' +
    '          <serialNumber>$SERIAL$</serialNumber>\n' +
    '          <vendor>$VENDOR$</vendor>\n' +
    '        </cashRegister>\n' +
    '      </cashRegistersService>\n' +
    '    </sir:deviceRouteStatus>\n' +
    '  </soapenv:Body>\n' +
    '</soapenv:Envelope>\n'
  let body = bodyTemplate
    .replace('$SERIAL$', deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace('$VENDOR$', deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace('$id$', moment().format('YYYYMMDDHHmmssSSS'))
  if (deviceRouting.cashRegistersService.messagingBroker) {
    body = body
      .replace('$AMQP_URL$', deviceRouting.cashRegistersService.messagingBroker.url)
      .replace('$AMQP_EXCHANGE$', deviceRouting.cashRegistersService.messagingBroker.amqp.exchange)
  }
  return body
}
