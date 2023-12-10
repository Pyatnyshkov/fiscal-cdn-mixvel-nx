export const extractGUIDEditorSubjects = (): string => {
  const url = new URL(location.href)
  const guidParam = url.searchParams.get('guid')

  if (!guidParam) {
    throw new Error('invalid guid')
  }

  return guidParam
}
