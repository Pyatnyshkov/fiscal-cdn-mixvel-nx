export const extractTokenEditorSubjects = (): unknown => {
  const url = new URL(window.location.href)
  const tokenParam = url.searchParams.get('token')

  if (!tokenParam) {
    throw new Error('invalid token')
  }

  try {
    if (tokenParam) {
      const departments = JSON.parse(decodeURIComponent(window.atob(tokenParam)))

      return departments
    }
  } catch (error) {
    throw new Error('decoded token')
  }
}

// var token = decodeURIComponent($.urlParam('token'))
// var token1 = decodeURIComponent(atob(token))
// editorModel.departments = JSON.parse(token1);
// for (i = 0; i < editorModel.departments.length; ++i) {
//  editorModel.departmentsByCode[editorModel.departments[i].code] = editorModel.departments[i];
