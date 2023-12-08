export const XMLParser = (xml: any) => {
  return new DOMParser().parseFromString(xml, 'text/xml')
}
