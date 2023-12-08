export const subjectsMockDataXML = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:tns="http://sirena-travel.ru"><soap:Body><tns:fetchSubjectsListResponse><subjectsList><identification><guid>07c99085-aabb-4ec1-ac25-3e21a95d020e</guid></identification><subjects><subject><name>Hellblade</name><price>1000</price><quantity>333</quantity><measure>777</measure><signs><subject codepage="fts-1.31_1#type">7</subject><method codepage="fts-1.31_1#featureOfSettlementMethod">4</method></signs><taxes><tax><vat><type codepage="fts-1.31_1#vatTaxType">2</type></vat></tax></taxes><restrictions><taxationSystems><taxationSystem><type codepage="fts-1.31_1#taxationSystem">0</type></taxationSystem></taxationSystems></restrictions><supplier><name>Redcat</name><tin>Darkcat</tin></supplier><agent><role codepage="fts-1.31_1#agentMode">4</role></agent></subject><subject><name>Pookmon</name><price>2000</price><quantity>222</quantity><measure>666</measure><signs><subject codepage="fts-1.31_1#type">10</subject><method codepage="fts-1.31_1#featureOfSettlementMethod">4</method></signs><taxes><tax><vat><type codepage="fts-1.31_1#vatTaxType">5</type></vat></tax></taxes><restrictions><taxationSystems><taxationSystem><type codepage="fts-1.31_1#taxationSystem">3</type></taxationSystem></taxationSystems></restrictions><agent><role codepage="fts-1.31_1#agentMode">16</role></agent></subject></subjects><dictionaries><taxes><tax><vat><type>1</type><description>НДС по ставке 18%</description></vat></tax><tax><vat><type>2</type><description>НДС по ставке 10%</description></vat></tax><tax><vat><type>3</type><description>НДС по расчетной ставке 18/118</description></vat></tax><tax><vat><type>4</type><description>НДС по расчетной ставке 10/110</description></vat></tax><tax><vat><type>5</type><description>НДС по ставке 0%</description></vat></tax><tax><vat><type>6</type><description>без НДС</description></vat></tax></taxes><taxationSystems><taxationSystem><type>0</type><description>общая СН</description></taxationSystem><taxationSystem><type>1</type><description>упрощенная СН(доходы)</description></taxationSystem><taxationSystem><type>2</type><description>упрощенная СН (доходы минус расходы)</description></taxationSystem><taxationSystem><type>3</type><description>единый налог на вмененный доход</description></taxationSystem><taxationSystem><type>4</type><description>единый сельскохозяйственный налог</description></taxationSystem><taxationSystem><type>5</type><description>патентная СН</description></taxationSystem></taxationSystems></dictionaries></subjectsList></tns:fetchSubjectsListResponse></soap:Body></soap:Envelope>`
