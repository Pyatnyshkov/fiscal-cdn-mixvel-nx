import { Token } from '../core/models/token.model'
import { pako } from './pako'

const urlTest = new URL(
  'http://localhost:8080/fh/index.html?token=jZHLSsNAFIZfRWbdpJPUWpOVihspVG1RcCWT5DQZTGbauYSWEtA30FcRCl6gzzB9I2cSCoIbd3Nu33%2F%2BMxtElBI00QokijeIZihGAcbh6DjC0QnGwTA8fQxxOAiCcBQMcTTAqOkhRVY3ZA3CzSjK7BDqIUYqsC%2FzZnb7Z%2FOxfzE7835kXs232ZovG27NpxumTCqhU0U5a0UzqGkKU64tKXeJlMhiCjmVCoScgXBll69ASpLbpgvBnzpxLUorSarlIu73yVJSb174MgVGBOXSpyzhmmXxeP0Q3SX15fg%2BOKtrL9GMrT088CUVttVTgtRQ%2BkL3z29nV9aKAzo8rNKCsNzZ6raUqLEOfi%2Fo2iQISsqJrhIX%2FzmgBdbAMu5qrUDTOErGU10BU63lApYaDuZph53rspz856i9wydY6oJTpq7nM1CqhA6PnOAP'
)
const urlTestFail = new URL('http://localhost:8080/fh/index.html?token=jZHLSsNAFIZfRWbdpJP')

export const extractToken = (): Token | undefined => {
  try {
    const url = new URL(location.href) // prod
    const tokenParam = urlTest.searchParams.get('token')

    if (tokenParam) {
      const decodedToken = window.atob(tokenParam) as any
      return JSON.parse(pako().inflateRaw(decodedToken, { to: 'string' }))
    }
  } catch (error) {
    throw new Error('token')
  }
}
