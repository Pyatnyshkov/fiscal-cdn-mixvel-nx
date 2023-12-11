import { GeneralError } from '@models/general/generalError.model'

export const getTextFromElement = (el: any): any => {
  if (!el) {
    return
  }
  if (el.length && el.length > 0) return getTextFromElement(el[0])
  return el.textContent || el.text
}

export const getNumberFromElement = (el: any) => {
  const t = getTextFromElement(el)
  if (t) return +t
  return 0
}

export const isElementHaveValue = (el: any) => {
  if (!el || !el.length || el.length === 0) return false
  return true
}

export const mangle = (s: any) => {
  if (s === undefined) return ''
  return (s + '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')
}

export const mangleNumber = (s: any) => {
  if (s === undefined) return ''
  return (s + '')
    .replace(/,/g, '.')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
}

type GetFaultFromResponse = (response: any) => GeneralError | undefined

export const getFaultFromResponse: GetFaultFromResponse = (response: any) => {
  if (!response) return
  try {
    const fault = response
      .getElementsByTagName('soap:Envelope')[0]
      .getElementsByTagName('soap:Fault')[0]
    if (fault) {
      const faultCodeX = fault.getElementsByTagName('faultcode')[0]
      const faultDescriptionX = fault.getElementsByTagName('faultstring')[0]
      if (faultCodeX) {
        return {
          code: `${getTextFromElement(faultCodeX)}`,
          description: `${getTextFromElement(faultDescriptionX)}`,
        }
      }
      let soapCode = fault.getElementsByTagName('soap:Code')[0]
      if (soapCode) {
        let soapSubCode = soapCode.getElementsByTagName('soap:Subcode')[0]
        if (soapSubCode)
          soapSubCode = getTextFromElement(soapCode.getElementsByTagName('soap:value')[0])
        let soapText = fault.getElementsByTagName('soap:Reason')[0]
        if (soapText) soapText = getTextFromElement(soapText.getElementsByTagName('soap:Text')[0])
        soapCode = getTextFromElement(soapCode.getElementsByTagName('soap:Value')[0])
        return {
          type: `${soapSubCode}` || undefined,
          code: `${soapCode}` || 'soapFault',
          description: `${soapText}` || 'internal error',
        }
      }
      return {
        code: 'soapFault',
        description: 'Unknown error',
      }
    }
  } catch (e) {
    return {
      code: 'soapTimeout',
      description: 'Network request timed out',
    }
  }
}

export const getErrorFromResponse = (response?: any, tagName?: string): undefined => {
  /*
    if (!response) return;
    var error = response.getElementsByTagName("soap:Envelope")[0];
    var error1;
    if (error) error = error.getElementsByTagName("soap:Body")[0];
    if (tagName) {
      if (error) error1 = error.getElementsByTagName(tagName)[0];
      if (!error1) error1 = error.getElementsByTagName(tagName + "Response")[0];
      if (error1) error = error1;
    }
    if (error) error1 = error.getElementsByTagName("error")[0];
    if (!error1) error1 = error.getElementsByTagName("tns:error")[0];
    error = error1;
    if (error) {
      return {
        code: getTextFromElement(error.getElementsByTagName("code")[0]),
        description: getTextFromElement(error.getElementsByTagName("description")[0])
      };
    }
  */
}

//@ts-ignore

export const buildResponseDelivery = (responseDelivery: ResponseDelivery) => {
  const soapResponseDeliveryTemplate =
    '          <soap>\n' +
    '            <service>\n' +
    '              <url>$serviceURL$</url>\n' +
    '            </service>\n' +
    '          </soap>\n'
  let socketioResponseDeliveryTemplate =
    '          <socketio>\n' +
    '            <client>\n' +
    '              <guid>$guid$</guid>\n' +
    '            </client>\n' +
    '          </socketio>\n'
  const xmlGateResponseDeliveryTemplate =
    '          <xmlGate>\n' +
    '            <messagingBroker>\n' +
    '              <url>$url$</url>\n' +
    '              <amqp>\n' +
    '                <request>\n' +
    '                  <exchange>$requestExchange$</exchange>\n' +
    '                  <routingKey>$requestRoutingKey$</routingKey>\n' +
    '                </request>\n' +
    '                <response>\n' +
    '                  <exchange>$responseExchange$</exchange>\n' +
    '                </response>\n' +
    '              </amqp>\n' +
    '            </messagingBroker>\n' +
    '          </xmlGate>\n'
  let rd = ''
  if (responseDelivery.soap)
    rd += soapResponseDeliveryTemplate.replace(
      '$serviceURL$',
      responseDelivery.soap.service.url || ''
    )
  if (responseDelivery.socketio) {
    const zoneId = responseDelivery.socketio.client.zoneId
    if (zoneId) {
      socketioResponseDeliveryTemplate = socketioResponseDeliveryTemplate.replace(
        '<guid>$guid$</guid>',
        '<guid>$guid$</guid>\n<zoneId>' + zoneId + '</zoneId>'
      )
    }
    rd += socketioResponseDeliveryTemplate.replace('$guid$', responseDelivery.socketio.client.guid)
  }
  if (responseDelivery.xmlGate) {
    const x = responseDelivery.xmlGate
    const messagingBroker = x.messagingBroker
    rd += xmlGateResponseDeliveryTemplate
      .replace('$url$', messagingBroker.url)
      .replace('$requestExchange$', messagingBroker.amqp.request.exchange)
      .replace('$requestRoutingKey$', messagingBroker.amqp.request.routingKey)
      .replace('$responseExchange$', messagingBroker.amqp.response.exchange)
  }
  return rd
}
