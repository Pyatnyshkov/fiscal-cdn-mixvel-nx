import { Instructions } from '@models/general/instructions.model'
import { SubjectsList } from '@models/subjects.model'
import { mangle, mangleNumber } from '../utils'

type DeviceRouting = Instructions['deviceRouting']

export const commitSubjects = (deviceRouting: string, subjects: SubjectsList[]): string => {
  let restrictionTemplate =
    '                  <taxationSystem>\n' +
    '                    <type codepage="fts-1.31_1#taxationSystem">$type$</type>\n' +
    '                  </taxationSystem>\n'
  let restrictionsTemplate =
    '              <restrictions>\n' +
    '                <taxationSystems>\n$taxationSystems$' +
    '                </taxationSystems>\n' +
    '              </restrictions>\n'
  let departmentTemplate =
    '              <department>\n' +
    '                <code>$code$</code>\n' +
    '                <title>$title$</title>\n' +
    '              </department>\n'
  let subjectTemplate =
    '            <subject>\n' +
    '              <name>$name$</name>\n' +
    '              <price>$price$</price>\n' +
    '              <quantity>$quantity$</quantity>\n' +
    '              <measure>$measure$</measure>\n' +
    '              <signs>\n' +
    '                <!--1212 Признак предмета расчета-->\n' +
    '                <subject codepage="fts-1.31_1#type">$subjectSign$</subject>\n' +
    '                <!--1214 Признак способа расчета-->\n' +
    '                <method codepage="fts-1.31_1#featureOfSettlementMethod">$methodSign$</method>\n' +
    '              </signs>\n' +
    '              <taxes>\n' +
    '                <tax>\n' +
    '                  <vat>\n' +
    '                    <type codepage="fts-1.31_1#vatTaxType">$type$</type>\n' +
    '                  </vat>\n' +
    '                </tax>\n' +
    '              </taxes>\n$restrictions$$department$$supplier$$agent$' +
    '            </subject>\n'
  var bodyTemplate =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://sirena-travel.ru">\n' +
    '  <soapenv:Header />\n' +
    '  <soapenv:Body>\n' +
    '    <sir:commitSubjectsList>\n' +
    '      <subjectsList>\n' +
    '        <identification>\n' +
    '          <guid>$guid$</guid>\n' +
    '        </identification>\n' +
    '        <fullSnapshot>\n' +
    '          <subjects>\n$subjects$' +
    '          </subjects>\n' +
    '        </fullSnapshot>\n' +
    '      </subjectsList>\n' +
    '    </sir:commitSubjectsList>\n' +
    '  </soapenv:Body>\n' +
    '</soapenv:Envelope>\n'
  let supplierTemplate = '<supplier><name>$name$</name><tin>$tin$</tin></supplier>'
  let agentTemplate = '<agent><role codepage="fts-1.31_1#agentMode">$role$</role></agent>'
  let ss = ''
  for (let i = 0; i < subjects.length; ++i) {
    const s = subjects[i]
    const restrictions = s.restrictions
    let rr = ''
    let supplier = ''
    let agent = ''
    let department = ''
    if (
      restrictions &&
      restrictions.taxationSystems &&
      restrictions.taxationSystems.taxationSystem
    ) {
      for (let j = 0; j < restrictions.taxationSystems.taxationSystem.length; ++j) {
        rr += restrictionTemplate.replace(
          '$type$',
          restrictions.taxationSystems.taxationSystem[j].type.$value
        )
      }
      rr = restrictionsTemplate.replace('$taxationSystems$', rr)
    }
    if (s.department) {
      department = departmentTemplate
        .replace('$code$', s.department.code)
        .replace('$title$', s.department.title)
    }
    supplier = ''
    agent = ''
    if (s.agent) {
      const agentRole = s.agent.role
      if (agentRole && agentRole.$value) agent = agentTemplate.replace('$role$', agentRole.$value)
    }
    if (s.supplier) {
      const subjectSupplier = s.supplier
      if (subjectSupplier.name || subjectSupplier.tin) {
        supplier = supplierTemplate
          .replace('$tin$', subjectSupplier.tin)
          .replace('$name$', subjectSupplier.name)
      }
    }
    ss += subjectTemplate
      .replace('$name$', mangle(s.name))
      .replace('$name$', mangle(s.name))
      .replace('$price$', mangle(s.price))
      .replace('$quantity$', mangle(s.quantity))
      .replace('$measure$', mangle(s.measure))
      .replace('$type$', mangle(s.taxes ? s.taxes.vat[0].type.$value : ''))
      .replace('$restrictions$', rr)
      .replace('$subjectSign$', mangleNumber(s.signs.subject.$value || 1))
      .replace('$methodSign$', mangleNumber(s.signs.method.$value || 4))
      .replace('$department$', department)
      .replace('$supplier$', supplier)
      .replace('$agent$', agent)
  }
  const body = bodyTemplate.replace('$guid$', deviceRouting).replace('$subjects$', ss)
  return body
}
