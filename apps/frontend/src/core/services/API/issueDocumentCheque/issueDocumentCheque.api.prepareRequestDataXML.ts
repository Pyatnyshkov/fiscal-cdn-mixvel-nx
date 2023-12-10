import { DocumentModel } from '@models/general/document.mode'
import { mangle, mangleNumber, buildResponseDelivery } from '../utils'
import { AgentRole } from '@consts'

export const issueDocumentChequePrepareRequestDataXML = (doc: DocumentModel): string => {
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
    '        <applicableExtensions>\n' +
    '          <!-- Количество копий -->\n' +
    '          <printoutCopies>\n' +
    '            <copies>$copies$</copies>\n' +
    '          </printoutCopies>\n' +
    '          $printoutInjections$\n' +
    '          <!-- Отделы для товаров -->\n' +
    '          <subjectsDepartments>\n' +
    '            <subjects>$departments$</subjects>\n' +
    '          </subjectsDepartments>\n' +
    '        </applicableExtensions>\n' +
    '      </instructions>\n' +
    '      <document>\n' +
    '        <!-- tag 1000 -->\n' +
    '        <cheque>\n' +
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
    '            <customer>\n' +
    '              <!--1008 Телефон или электронный адрес покупателя-->\n' +
    '              <!--1008-->\n' +
    '              <phone>$phone$</phone>\n' +
    '              <email>$email$</email>\n' +
    '            </customer>\n' +
    '            <settlement>\n' +
    '              <subjects>$subjects$\n' +
    '              </subjects>\n' +
    '            </settlement>\n' +
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
    '            <taxes>$taxes$\n' +
    '            </taxes>\n' +
    '          </$$chequeType$$>\n' +
    '        </cheque>\n' +
    '      </document>\n' +
    '    </sir:issueDocument>\n' +
    '  </soapenv:Body>\n' +
    '</soapenv:Envelope>\n'

  const subjectTemplate =
    '                <subject>\n' +
    '                  <!--1030 Наименование предмета расчета-->\n' +
    '                  <name>$subjectName$</name>\n' +
    '                  <!--1079 Цена за единицу предмета расчета с Aучетом скидок и наценок-->\n' +
    '                  <price>$subjectPrice$</price>\n' +
    '                  <!--1023 Количество предмета расчета-->\n' +
    '                  <quantity>$subjectQuantity$</quantity>\n' +
    '                  <!--1043 Стоимость предмета расчета с учетом скидок и наценок-->\n' +
    '                  <amount>$subjectAmount$</amount>\n' +
    '                  <!--1197 Eдиница измерения предмета расчета-->\n' +
    '                  <measure>$subjectMeasure$</measure>' +
    '                  <signs>\n' +
    '                    <!--1212 Признак предмета расчета-->\n' +
    '                    <subject codepage="fts-1.31_1#type">$subjectSign$</subject>\n' +
    '                    <!--1214 Признак способа расчета-->\n' +
    '                    <method codepage="fts-1.31_1#featureOfSettlementMethod">$methodSign$</method>\n' +
    '                  </signs>\n' +
    '                  <taxes>\n' +
    '                    <vat>\n' +
    '                      <!--1199 Ставка НДС-->\n' +
    '                      <type codepage="fts-1.31_1#vatTaxType">$subjectVAType$</type>\n' +
    '                      <!--1200 Сумма НДС за предмет расчета-->\n' +
    '                      <amount>$subjectVATAmount$</amount>\n' +
    '                    </vat>\n' +
    '                  </taxes>\n$supplier$$agent$' +
    '                </subject>\n'
  const taxesTemplate =
    '              <vat>\n' +
    '                <!--18%-->\n' +
    '                <type codepage="fts-1.31_1#vatTaxType">$taxType$</type>\n' +
    '                <!--1102 Сумма НДС чека по ставке 18%-->\n' +
    '                <amount>$taxAmount$</amount>\n' +
    '              </vat>\n'
  const supplierTemplate = '<supplier><name>$name$</name><tin>$tin$</tin></supplier>'
  const agentTemplate = '<agent><roles>$role$</roles></agent>'
  const agentRoles = {
    1: 'bankPaymentAgent',
    2: 'bankPaymentSubagent',
    4: 'paymentAgent',
    8: 'paymentSubagent',
    16: 'attorney',
    32: 'commissionAgent',
    64: 'another',
  }
  let supplier = ''
  let agent = ''
  let printoutInjections = ''
  let departmentTemplate = '<subject><department code="$code$" /></subject>\n'
  const document = doc.document
  const cheque = document.cheque

  if (!cheque) {
    return ''
  }

  let chequeType = ''
  let chequeContent = cheque.credit || cheque.debit || cheque.creditReturn || cheque.debitReturn
  if (cheque.credit) {
    chequeType = 'credit'
  }
  if (cheque.debit) {
    chequeType = 'debit'
  }
  if (cheque.creditReturn) {
    chequeType = 'creditReturn'
  }
  if (cheque.debitReturn) {
    chequeType = 'debitReturn'
  }
  if (doc.chequeType) chequeType = doc.chequeType
  let subjects = ''
  let taxes = ''

  if (!chequeContent) {
    return ''
  }

  const items = chequeContent.settlement.subjects.subject
  let departments = ''
  if (items && items.length) {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i]
      supplier = ''
      agent = ''
      if (item.agent) {
        const agentRole = item.agent.role
        if (agentRole && agentRole.$value)
          agent = agentTemplate.replace('$role$', '<' + AgentRole[agentRole.$value] + ' />')
      }
      if (item.supplier) {
        const subjectSupplier = item.supplier
        if (subjectSupplier.name || subjectSupplier.tin) {
          supplier = supplierTemplate
            .replace('$tin$', subjectSupplier.tin)
            .replace('$name$', subjectSupplier.name)
        }
      }
      subjects += subjectTemplate
        .replace('$subjectName$', mangle(item.name))
        .replace('$subjectPrice$', mangle(item.price))
        .replace('$subjectQuantity$', mangle(item.quantity))
        .replace('$subjectAmount$', mangle(item.amount))
        .replace('$subjectMeasure$', mangle(item.measure))
        .replace('$subjectVAType$', `${item.taxes.vat[0].type.$value}`)
        .replace('$subjectVATAmount$', mangle(item.taxes.vat[0].amount))
        .replace('$subjectSign$', mangle(item.signs.subject.$value || '1'))
        .replace('$methodSign$', mangle(item.signs.method.$value || '4'))
        .replace('$supplier$', supplier)
        .replace('$agent$', agent)
      departments += departmentTemplate.replace('$code$', item.department?.code || '1')
    }
  }
  const taxArray = chequeContent.taxes.vat || []
  if (taxArray.length) {
    for (let i = 0; i < taxArray.length; ++i) {
      taxes += taxesTemplate
        .replace('$taxType$', `${taxArray[i].type.$value}`)
        .replace('$taxAmount$', mangleNumber(taxArray[i].amount))
    }
  }
  const documentReferenceNumber = doc.printoutInjections.documentReferenceNumber || ''
  const maskedCardPAN = doc.printoutInjections.payments.forms.electronic.maskedCardPAN || ''
  if (documentReferenceNumber.length || maskedCardPAN.length) {
    printoutInjections += '<printoutInjections>'
    if (documentReferenceNumber.length)
      printoutInjections +=
        '<documentReferenceNumber>' + mangle(documentReferenceNumber) + '</documentReferenceNumber>'
    if (maskedCardPAN.length)
      printoutInjections +=
        '<payments><forms><electronic><maskedCardPAN>' +
        mangle(maskedCardPAN) +
        '</maskedCardPAN></electronic></forms></payments>'
    printoutInjections += '</printoutInjections>'
  }
  let body = bodyTemplate
    .replace('$id$', `${doc.attributes.id}`)
    .replace('$$chequeType$$', chequeType)
    .replace('$$chequeType$$', chequeType)
    .replace('$copies$', doc.copies || '1')
    .replace('$copies$', doc.copies || '1')
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
    .replace('$taxationSystem$', `${chequeContent.taxationSystem.$value}`)
    .replace('$phone$', mangle(chequeContent.customer.phone) || '')
    .replace('$email$', mangle(chequeContent.customer.email) || '')
    .replace('$eAmount$', mangleNumber(chequeContent.payments.forms.electronic.amount || ''))
    .replace('$cAmount$', mangle(chequeContent.payments.forms.cash.amount || ''))
    .replace(
      '$considerationAmount$',
      mangleNumber(chequeContent.payments.forms.consideration.amount || '')
    )
    .replace('$tAmount$', mangle(chequeContent.payments.total.amount || ''))
    .replace('$responseDelivery$', buildResponseDelivery(doc.instructions.responseDelivery))
    .replace('$subjects$', subjects)
    .replace('$taxes$', taxes)
    .replace('$departments$', departments)
    .replace('$printoutInjections$', printoutInjections)
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
