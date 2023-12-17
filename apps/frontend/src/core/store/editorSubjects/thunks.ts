import { SubjectsEditorDataRequest } from '@models/data/subjectsEditor.data.request.model'
import { AppThunk } from '@store'
import { selectSubjectsEntities } from '@store/subjects/selectors'
import { selectEditorSubjectsSOAPEndpoint } from './selectors'

export const fetchCommitSubject: AppThunk = async (dispatch, getState, { API }) => {
  const { editorSubjects } = getState()
  const subjectsEntities = selectSubjectsEntities(getState())
  const subjectsSOAPEndpoint = selectEditorSubjectsSOAPEndpoint(getState())

  const commitSubjectsData = Object.values(subjectsEntities).reduce<SubjectsEditorDataRequest[]>(
    (acc, subject) => {
      if (!subject) {
        return acc
      }
      const subjectElement: SubjectsEditorDataRequest = {
        name: subject.name,
        price: subject.price,
        quantity: subject.quantity,
        measure: subject.measure,
        taxes: {
          vat: [
            {
              type: {
                $value: subject.taxes,
                attributes: {
                  codepage: 'fts-1.31_1#vatTaxType',
                },
              },
            },
          ],
        },
        signs: {
          subject: {
            attributes: {
              codepage: 'fts-1.31_1#type',
            },
            $value: subject.signsSubject,
          },
        },
      }

      if (subject.agentRole) {
        subjectElement.agent = {
          role: {
            $value: subject.agentRole,
            attributes: {
              codepage: 'fts-1.31_1#agentMode',
            },
          },
        }
      }

      if (subject.restrictionsTaxationSystems.length) {
        subjectElement.restrictions = {
          taxationSystems: {
            taxationSystem: subject.restrictionsTaxationSystems,
          },
        }
      }

      if (subject.supplierName || subject.supplierTin) {
        subjectElement.supplier = {
          name: subject.supplierName,
          tin: subject.supplierTin,
        }
      }

      if (subject.department.code) {
        subjectElement.department = {
          code: subject.department.code,
          title: subject.department.title,
        }
      }

      acc.push(subjectElement)
      return acc
    },
    []
  )

  try {
    const subjectData = await API.commitSubjects.post(
      subjectsSOAPEndpoint,
      editorSubjects.identification.guid,
      commitSubjectsData
    )
    // dispatch(appSubjectsSlice.actions.success(subjectData))
  } catch (error) {
    console.log(error)
  }
}
