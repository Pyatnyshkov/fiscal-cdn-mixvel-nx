import { App } from '@models/app.model'
import { Instructions } from '@models/general/instructions.model'

export type SubjectsDeviceRouting = string | Instructions['deviceRouting']

export const subjectsPrepareRequestDataXML = (deviceRouting: SubjectsDeviceRouting): string => {
  var bodyTemplateCR =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://sirena-travel.ru">\n' +
    '  <soapenv:Header />\n' +
    '  <soapenv:Body>\n' +
    '    <sir:fetchSubjectsList>\n' +
    '      <subjectsListIdentification>\n' +
    '        <cashRegister>\n' +
    '          <serialNumber>$SERIAL$</serialNumber>\n' +
    '          <vendor>$VENDOR$</vendor>\n' +
    '        </cashRegister>\n' +
    '      </subjectsListIdentification>\n' +
    '    </sir:fetchSubjectsList>\n' +
    '  </soapenv:Body>\n' +
    '</soapenv:Envelope>\n'
  var bodyTemplateGUID =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://sirena-travel.ru">\n' +
    '  <soapenv:Header />\n' +
    '  <soapenv:Body>\n' +
    '    <sir:fetchSubjectsList>\n' +
    '      <subjectsListIdentification>\n' +
    '        <identification>\n' +
    '          <guid>$guid$</guid>\n' +
    '        </identification>\n' +
    '      </subjectsListIdentification>\n' +
    '    </sir:fetchSubjectsList>\n' +
    '  </soapenv:Body>\n' +
    '</soapenv:Envelope>\n'

  var body = ''

  if (typeof deviceRouting === 'string') {
    body = bodyTemplateGUID.replace('$guid$', deviceRouting)
    return body
  }

  if (deviceRouting.cashRegistersService) {
    body = bodyTemplateCR
      .replace('$SERIAL$', deviceRouting.cashRegistersService.cashRegister.serialNumber)
      .replace('$VENDOR$', deviceRouting.cashRegistersService.cashRegister.vendor)
  }
  return body
}
