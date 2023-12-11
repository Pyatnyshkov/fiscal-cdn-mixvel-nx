import { SubjectsEditorDataRequest } from '@models/data/subjectsEditor.data.request.model'
import { AppThunk } from '@store'
import { selectSubjectsEntities } from '@store/subjects/selectors'

export const fetchCommitSubject: AppThunk = async (dispatch, getState, { API }) => {
  const { network, editorSubjects } = getState()
  const subjectsEntities = selectSubjectsEntities(getState())

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
        agent: {
          role: {
            $value: subject.agentRole,
            attributes: {
              codepage: 'fts-1.31_1#agentMode',
            },
          },
        },
        signs: {
          subject: {
            attributes: {
              codepage: 'fts-1.31_1#type',
            },
            $value: subject.signsSubject,
          },
        },
        restrictions: {
          taxationSystems: {
            taxationSystem: subject.restrictionsTaxationSystems,
          },
        },
        supplier: {
          name: subject.supplierName,
          tin: subject.supplierTin,
        },
        department: {
          code: '',
          title: '',
        },
      }
      acc.push(subjectElement)
      return acc
    },
    []
  )

  try {
    const subjectData = await API.commitSubjects.post(
      network.subjectsSOAPEndpoint,
      editorSubjects.identification.guid,
      commitSubjectsData
    )
    console.log(subjectData)
    // dispatch(appSubjectsSlice.actions.success(subjectData))
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
  }
}
