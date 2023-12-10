import { DocumentModel } from '@models/general/document.mode'
import { buildResponseDelivery } from '../utils'
import { DocumentCurrentSettlementReportData } from '@models/data/documentCurrentSettlementReport.data.model'

export const issueDocumentCurrentSettlementReportPrepareRequestDataXML = (
  doc: DocumentCurrentSettlementReportData
): string => {
  const bodyTemplate =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://sirena-travel.ru">\n' +
    '  <soapenv:Header />\n' +
    '  <soapenv:Body>\n' +
    '    <sir:issueDocument id="$id$">\n' +
    '      <taxPayer>\n' +
    '        <!-- tag 1018 ИНН пользователя -->\n' +
    '        <tin>$taxPayerTIN$</tin>\n' +
    '\n' +
    '        <!-- tag 1048 Наименование пользователя -->\n' +
    '        <name>$taxPayerName$</name>\n' +
    '      </taxPayer>\n' +
    '\n' +
    '      <instructions>\n' +
    '        <deviceRouting>\n' +
    '          <cashRegistersService>\n' +
    '            <messagingBroker>\n' +
    '              <url>$url$</url>\n' +
    '              <amqp>\n' +
    '                <exchange>$exchange$</exchange>\n' +
    '              </amqp>\n' +
    '            </messagingBroker>\n' +
    '            <cashRegister>\n' +
    '              <serialNumber>$serialNumber$</serialNumber>\n' +
    '              <vendor>$vendor$</vendor>\n' +
    '            </cashRegister>\n' +
    '          </cashRegistersService>\n' +
    '        </deviceRouting>\n' +
    '        <responseDelivery>\n$responseDelivery$' +
    '        </responseDelivery>\n' +
    '      </instructions>\n' +
    '\n' +
    '      <document>\n' +
    '        <!-- tag 1000 -->\n' +
    '        <currentSettlementReport />\n' +
    '      </document>\n' +
    '    </sir:issueDocument>\n' +
    '  </soapenv:Body>\n' +
    '</soapenv:Envelope>\n'

  let body = bodyTemplate
    .replace('$id$', doc.attributes.id)
    .replace('$taxPayerTIN$', doc.taxPayer.tin)
    .replace('$taxPayerName$', doc.taxPayer.name)
    .replace(
      '$serialNumber$',
      doc.instructions.deviceRouting.cashRegistersService.cashRegister.serialNumber
    )
    .replace('$vendor$', doc.instructions.deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace('$responseDelivery$', buildResponseDelivery(doc.instructions.responseDelivery))
  if (doc.instructions.deviceRouting.cashRegistersService.messagingBroker) {
    body = body
      .replace('$url$', doc.instructions.deviceRouting.cashRegistersService.messagingBroker.url)
      .replace(
        '$exchange$',
        doc.instructions.deviceRouting.cashRegistersService.messagingBroker.amqp.exchange
      )
  }
  return body
}
