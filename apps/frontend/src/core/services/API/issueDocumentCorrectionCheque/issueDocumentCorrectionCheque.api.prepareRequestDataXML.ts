import { DocumentModel } from '@models/general/document.mode'
import { mangle, buildResponseDelivery } from '../utils'
import { DocumentCorrectionCheque } from '@models/general/documentCorrectionCheque.model'

export const issueDocumentCorrectionCheque = (doc: DocumentCorrectionCheque): string => {
  const bodyTemplate =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://sirena-travel.ru">\n' +
    '  <soapenv:Header />\n' +
    '  <soapenv:Body>\n' +
    '    <sir:issueDocument id="$id$">\n' +
    '      <taxPayer>\n' +
    '        <tin>$taxPayerTIN$</tin>\n' +
    '        <name>$taxPayerName$</name>\n' +
    '      </taxPayer>\n' +
    '      <instructions>\n' +
    '        <deviceRouting>\n' +
    '          <cashRegistersService>\n' +
    '            <messagingBroker>\n' +
    '              <url>$deviceURL$</url>\n' +
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
    '      <document>\n' +
    '        <!-- tag 1000 -->\n' +
    '        <correctionCheque>\n' +
    '          <copies>$copies$</copies>\n' +
    '          <cashier>\n' +
    '            <!--1021 Кассир-->\n' +
    '            <fullName>$fullName$</fullName>\n' +
    '            <!--1203 ИНН кассира-->\n' +
    '            <tin>$tin$</tin>\n' +
    '          </cashier>\n' +
    '          <pointOfSettlement>\n' +
    '            <!--1009 Адрес расчетов-->\n' +
    '            <address>$address$</address>\n' +
    '          </pointOfSettlement>\n' +
    '          <!--credit debit creditReturn debitReturn tag 1054-->\n' +
    '          <$$chequeType$$>\n' +
    '            <!--1055 Применяемая система налогообложения-->\n' +
    '            <taxationSystem codepage="fts-1.31_1#taxationSystem">$taxationSystem$</taxationSystem>\n' +
    '            <correction>\n' +
    '              <!-- 1173 тип коррекции -->\n' +
    '              <$ownOrForced$ /> <!-- forced -->\n' +
    '              <!-- 1174 основание для коррекции -->\n' +
    '              <reason>\n' +
    '                <!-- 1177 описание коррекции -->\n' +
    '                <description>$correctionReasonDescription$</description>\n' +
    '                <!-- 1178 дата документа основания для коррекции -->\n' +
    '                <date>$correctionReasonDate$</date>\n' +
    '                <!-- 1179 номер документа основания для коррекции -->\n' +
    '                <documentNumber>$correctionReasonDocumentNumber$</documentNumber>\n' +
    '              </reason>\n' +
    '            </correction>' +
    '            <payments>\n' +
    '              <forms>\n' +
    '                <electronic>\n' +
    '                  <!--1031 Сумма по чеку (БСО) наличными-->\n' +
    '                  <amount>$eAmount$</amount>\n' +
    '                </electronic>\n' +
    '                <cash>\n' +
    '                  <!--1031 Сумма по чеку (БСО) наличными-->\n' +
    '                  <amount>$cAmount$</amount>\n' +
    '                </cash>\n' +
    '                <consideration>\n' +
    '                  <!--1217 Встречное предоставление-->\n' +
    '                  <amount>$considerationAmount$</amount>\n' +
    '                </consideration>\n' +
    '              </forms>\n' +
    '              <total>\n' +
    '                <!--1020 Сумма расчета, указанного в чеке (БСО)-->\n' +
    '                <amount>$tAmount$</amount>\n' +
    '              </total>\n' +
    '            </payments>\n' +
    '            <taxes>\n' +
    '              <vat>\n' +
    '                <!--18%-->\n' +
    '                <type codepage="fts-1.31_1#vatTaxType">$taxType$</type>\n' +
    '              </vat>\n' +
    '            </taxes>\n' +
    '          </$$chequeType$$>\n' +
    '        </correctionCheque>\n' +
    '      </document>\n' +
    '    </sir:issueDocument>\n' +
    '  </soapenv:Body>\n' +
    '</soapenv:Envelope>\n'
  const document = doc.document || doc
  const cheque = document.correctionCheque

  if (!cheque) {
    return ''
  }

  let chequeType = ''
  let chequeContent
  if (cheque.credit) {
    chequeType = 'credit'
    chequeContent = cheque.credit
  }
  if (cheque.debit) {
    chequeType = 'debit'
    chequeContent = cheque.debit
  }

  if (!chequeContent) {
    return ''
  }
  const correction = chequeContent.correction
  let body =
    bodyTemplate
      .replace('$id$', `${doc.attributes.id}`)
      .replace('$$chequeType$$', chequeType)
      .replace('$$chequeType$$', chequeType)
      .replace('$ownOrForced$', cheque.ownOrForced)
      .replace('$correctionReasonDescription$', correction.reason.description)
      .replace('$correctionReasonDate$', correction.reason.date)
      .replace('$correctionReasonDocumentNumber$', correction.reason.documentNumber)
      .replace('$copies$', '1')
      // .replace('$copies$', doc.copies || '1')
      .replace('$taxPayerTIN$', doc.taxPayer.tin)
      .replace('$taxPayerName$', mangle(doc.taxPayer.name))
      .replace('$tin$', cheque.cashier.tin)
      .replace('$fullName$', mangle(cheque.cashier.fullName))
      .replace(
        '$serialNumber$',
        doc.instructions.deviceRouting.cashRegistersService.cashRegister.serialNumber
      )
      .replace('$vendor$', doc.instructions.deviceRouting.cashRegistersService.cashRegister.vendor)
      .replace('$address$', mangle(cheque.pointOfSettlement.address))
      .replace('$taxationSystem$', `${cheque.taxationSystem.$value}`)
      .replace('$eAmount$', chequeContent.payments.forms.electronic.amount || '')
      .replace('$cAmount$', chequeContent.payments.forms.cash.amount || '')
      .replace('$considerationAmount$', chequeContent.payments.forms.consideration.amount || '')
      .replace('$tAmount$', chequeContent.payments.forms.electronic.amount || '0') +
    (chequeContent.payments.forms.cash.amount || '0')
      .replace('$responseDelivery$', buildResponseDelivery(doc.instructions.responseDelivery))
      .replace('$taxType$', chequeContent.taxes.vat[0].type.$value)
  if (doc.instructions.deviceRouting.cashRegistersService.messagingBroker) {
    body = body
      .replace(
        '$deviceURL$',
        doc.instructions.deviceRouting.cashRegistersService.messagingBroker.url
      )
      .replace(
        '$exchange$',
        doc.instructions.deviceRouting.cashRegistersService.messagingBroker.amqp.exchange
      )
  }
  return body
}
