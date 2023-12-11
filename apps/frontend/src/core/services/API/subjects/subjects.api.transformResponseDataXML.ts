import { getTextFromElement } from '../utils'
import { Subjects } from '@models/subjects.model'

export type SubjectsData = {
  identification: Subjects['identification']
  subjects: Subjects['subjects']
}

type SubjectsTransformResponseDataXML = (data: any) => SubjectsData

export const subjectsTransformResponseDataXML: SubjectsTransformResponseDataXML = (res) => {
  // const fault = getFaultFromResponse(res)
  // if (fault) return callback(fault);
  // const error = getErrorFromResponse(res)
  // if (error) return callback(error);
  const subjectsList = res
    .getElementsByTagName('soap:Envelope')[0]
    .getElementsByTagName('soap:Body')[0]
    .getElementsByTagName('tns:fetchSubjectsListResponse')[0]
    .getElementsByTagName('subjectsList')[0]

  // if (!subjectsList) return callback({
  //   description: "No subjectsList in response"
  // });

  const identification = getTextFromElement(subjectsList.getElementsByTagName('guid')[0])
  const subjects = []
  const subjectX = subjectsList.getElementsByTagName('subject')
  let i
  for (i = 0; i < subjectX.length; ++i) {
    const sX = subjectX[i]
    const nameX = sX.getElementsByTagName('name')[0]
    if (!nameX) continue
    const s: any = {
      name: getTextFromElement(nameX),
      price: getTextFromElement(sX.getElementsByTagName('price')),
      quantity: getTextFromElement(sX.getElementsByTagName('quantity')),
      measure: getTextFromElement(sX.getElementsByTagName('measure')),
    }
    const departmentX = sX.getElementsByTagName('department')[0]
    if (departmentX) {
      const department = {
        code: getTextFromElement(departmentX.getElementsByTagName('code')),
        title: getTextFromElement(departmentX.getElementsByTagName('title')),
      }
      s.department = department
      s.departmentCode = department.code
    }
    const taxesX = sX.getElementsByTagName('taxes')[0]
    if (taxesX) {
      const type = getTextFromElement(taxesX.getElementsByTagName('type')[0])
      s.taxes = {
        vat: [
          {
            amount: 0,
            type: {
              $value: type,
              attributes: {
                codepage: 'fts-1.31_1#vatTaxType',
              },
            },
          },
        ],
      }
    }
    const agentX = sX.getElementsByTagName('agent')[0]
    if (agentX) {
      const role = getTextFromElement(agentX.getElementsByTagName('role')[0])
      s.agent = {
        role: {
          $value: +role,
          attributes: {
            codepage: 'fts-1.31_1#agentMode',
          },
        },
      }
      const supplierX = sX.getElementsByTagName('supplier')[0]
      if (supplierX) {
        s.supplier = {
          name: getTextFromElement(supplierX.getElementsByTagName('name')[0]),
          tin: getTextFromElement(supplierX.getElementsByTagName('tin')[0]),
        }
      }
    }
    const signsX = sX.getElementsByTagName('signs')[0]
    if (signsX) {
      const subjX = signsX.getElementsByTagName('subject')[0]
      const methX = signsX.getElementsByTagName('method')[0]
      s.signs = {
        subject: {
          attributes: {
            codepage: 'fts-1.31_1#type',
          },
          $value: (subjX && getTextFromElement(subjX)) || 1,
        },
        method: {
          attributes: {
            codepage: 'fts-1.31_1#featureOfSettlementMethod',
          },
          $value: (methX && getTextFromElement(methX)) || 4,
        },
      }
    }
    const restrictionsX = sX.getElementsByTagName('restrictions')[0]
    if (restrictionsX) {
      const ts = restrictionsX.getElementsByTagName('taxationSystem')
      // eslint-disable-next-line no-var
      var j
      for (j = 0; j < ts.length; ++j) {
        if (!s.restrictions)
          s.restrictions = {
            taxationSystems: {
              taxationSystem: [],
            },
          }
        s.restrictions.taxationSystems.taxationSystem.push({
          type: {
            $value: getTextFromElement(ts[j].getElementsByTagName('type')[0]),
            attributes: {
              codepage: 'fts-1.31_1#taxationSystem',
            },
          },
        })
      }
    }
    subjects.push(s)
  }
  const resp = {
    identification: {
      guid: identification,
    },
    subjects: subjects,
  }
  return resp
}
