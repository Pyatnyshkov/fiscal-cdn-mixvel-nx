function SOAPDocumentsV2(endpoint) {
  this.endpoint = endpoint;
}

function SOAPRoutingStatusV1(endpoint) {
  this.endpoint = endpoint;
}

function SOAPOperationsV1(endpoint) {
  this.endpoint = endpoint;
}

function SOAPSubjectsV1(endpoint) {
  this.endpoint = endpoint;
}

function getNumberFromElement(el) {
  var t = getTextFromElement(el);
  if (t) return +t;
  return 0;
}

function getTextFromElement(el) {
  if (!el) return undefined;
  if (el.length && el.length > 0) return getTextFromElement(el[0]);
  return el.textContent || el.text;
}

function isElementHaveValue(el) {
  if (!el || !el.length || el.length === 0) return false;
  return true;
}

function mangle(s) {
  if (s == undefined) return "";
  return (s + "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
}

function mangleNumber(s) {
  if (s == undefined) return "";
  return (s + "").replace(/,/g, ".").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
}

function getFaultFromResponse(response) {
  if (!response) return;
  try {
    var fault = response.getElementsByTagName("soap:Envelope")[0]
      .getElementsByTagName("soap:Fault")[0];
    if (fault) {
      var faultCodeX = fault.getElementsByTagName("faultcode")[0];
      var faultDescriptionX = fault.getElementsByTagName("faultstring")[0];
      if (faultCodeX) {
        return {
          code: getTextFromElement(faultCodeX),
          description: getTextFromElement(faultDescriptionX)
        }
      }
      var soapCode = fault.getElementsByTagName("soap:Code")[0];
      if (soapCode) {
        var soapSubCode = soapCode.getElementsByTagName("soap:Subcode")[0];
        if (soapSubCode) soapSubCode = getTextFromElement(soapCode.getElementsByTagName("soap:value")[0]);
        var soapText = fault.getElementsByTagName("soap:Reason")[0];
        if (soapText) soapText = getTextFromElement(soapText.getElementsByTagName("soap:Text")[0]);
        soapCode = getTextFromElement(soapCode.getElementsByTagName("soap:Value")[0]);
        return {
          type: soapSubCode || undefined,
          code: soapCode || "soapFault",
          description: soapText || "internal error"
        }
      }
      return {
        code: "soapFault",
        description: "Unknown error"
      }
    }
  } catch (e) {
    return {
      code: "soapTimeout",
      description: "Network request timed out"
    }
  }
}

function getErrorFromResponse(response, tagName) {
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

function buildResponseDelivery(responseDelivery) {
  var soapResponseDeliveryTemplate = "          <soap>\n" +
    "            <service>\n" +
    "              <url>$serviceURL$</url>\n" +
    "            </service>\n" +
    "          </soap>\n";
  var socketioResponseDeliveryTemplate = "          <socketio>\n" +
    "            <client>\n" +
    "              <guid>$guid$</guid>\n" +
    "            </client>\n" +
    "          </socketio>\n";
  var xmlGateResponseDeliveryTemplate = "          <xmlGate>\n" +
    "            <messagingBroker>\n" +
    "              <url>$url$</url>\n" +
    "              <amqp>\n" +
    "                <request>\n" +
    "                  <exchange>$requestExchange$</exchange>\n" +
    "                  <routingKey>$requestRoutingKey$</routingKey>\n" +
    "                </request>\n" +
    "                <response>\n" +
    "                  <exchange>$responseExchange$</exchange>\n" +
    "                </response>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "          </xmlGate>\n";
  var rd = "";
  if (responseDelivery.soap)
    rd += soapResponseDeliveryTemplate.replace("$serviceURL$", responseDelivery.soap.service.url || "");
  if (responseDelivery.socketio) {
    var zoneId = responseDelivery.socketio.client.zoneId;
    if (zoneId) {
      socketioResponseDeliveryTemplate = socketioResponseDeliveryTemplate.replace("<guid>$guid$</guid>",
        "<guid>$guid$</guid>\n<zoneId>" + zoneId + "</zoneId>");
    }
    rd += socketioResponseDeliveryTemplate.replace("$guid$", responseDelivery.socketio.client.guid);
  }
  if (responseDelivery.xmlGate) {
    var x = responseDelivery.xmlGate;
    var messagingBroker = x.messagingBroker;
    rd += xmlGateResponseDeliveryTemplate.replace("$url$", messagingBroker.url)
      .replace("$requestExchange$", messagingBroker.amqp.request.exchange)
      .replace("$requestRoutingKey$", messagingBroker.amqp.request.routingKey)
      .replace("$responseExchange$", messagingBroker.amqp.response.exchange);
  }
  return rd;
}

SOAPDocumentsV2.prototype.issueDocument = function (document, callback) {
  var self = this;
  if (document.document && document.document.openShiftReport) return this._issueDocumentOpenShift(document, callback);
  if (document.document && document.document.closeShiftReport) return this._issueDocumentCloseShift(document, callback);
  if (document.document && document.document.currentSettlementReport) return this._issueDocumentCurrentSettlementReport(document, callback);
  if (document.document && document.document.cheque) return this._issueDocumentCheque(document, callback);
  if (document.document && document.document.correctionCheque) return this._issueDocumentCorrectionCheque(document, callback);
};

SOAPDocumentsV2.prototype.getSOAPRequestHeaders = function (responseDelivery) {
  if (responseDelivery.socketio && responseDelivery.socketio.client) {
    var zoneId = responseDelivery.socketio.client.zoneId;
    if (zoneId) return {
      "X-Zone-Id": zoneId
    };
  }
  return {};
};

function stringToXMLDom(string) {
  try {
    var xmlDoc = null;
    if (window.DOMParser) {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(string, "text/xml");
    } else // Internet Explorer
    {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(string);
    }
    return xmlDoc;
  } catch (e) {
    return undefined;
  }
}

SOAPDocumentsV2.prototype._issueDocumentCheque = function (doc, callback) {
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:issueDocument id=\"$id$\">\n" +
    "      <taxPayer>\n" +
    "        <tin>$taxPayerTIN$</tin>\n" +
    "        <name>$taxPayerName$</name>\n" +
    "      </taxPayer>\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$deviceURL$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$exchange$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$serialNumber$</serialNumber>\n" +
    "              <vendor>$vendor$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "        <responseDelivery>\n$responseDelivery$" +
    "        </responseDelivery>\n" +
    "        <applicableExtensions>\n" +
    "          <!-- Количество копий -->\n" +
    "          <printoutCopies>\n" +
    "            <copies>$copies$</copies>\n" +
    "          </printoutCopies>\n" +
    "          $printoutInjections$\n" +
    "          <!-- Отделы для товаров -->\n" +
    "          <subjectsDepartments>\n" +
    "            <subjects>$departments$</subjects>\n" +
    "          </subjectsDepartments>\n" +
    "        </applicableExtensions>\n" +
    "      </instructions>\n" +
    "      <document>\n" +
    "        <!-- tag 1000 -->\n" +
    "        <cheque>\n" +
    "          <copies>$copies$</copies>\n" +
    "          <cashier>\n" +
    "            <!--1021 Кассир-->\n" +
    "            <fullName>$fullName$</fullName>\n" +
    "            <!--1203 ИНН кассира-->\n" +
    "            <tin>$tin$</tin>\n" +
    "          </cashier>\n" +
    "          <pointOfSettlement>\n" +
    "            <!--1009 Адрес расчетов-->\n" +
    "            <address>$address$</address>\n" +
    "          </pointOfSettlement>\n" +
    "          <!--credit debit creditReturn debitReturn tag 1054-->\n" +
    "          <$$chequeType$$>\n" +
    "            <!--1055 Применяемая система налогообложения-->\n" +
    "            <taxationSystem codepage=\"fts-1.31_1#taxationSystem\">$taxationSystem$</taxationSystem>\n" +
    "            <customer>\n" +
    "              <!--1008 Телефон или электронный адрес покупателя-->\n" +
    "              <!--1008-->\n" +
    "              <phone>$phone$</phone>\n" +
    "              <email>$email$</email>\n" +
    "            </customer>\n" +
    "            <settlement>\n" +
    "              <subjects>$subjects$\n" +
    "              </subjects>\n" +
    "            </settlement>\n" +
    "            <payments>\n" +
    "              <forms>\n" +
    "                <electronic>\n" +
    "                  <!--1031 Сумма по чеку (БСО) наличными-->\n" +
    "                  <amount>$eAmount$</amount>\n" +
    "                </electronic>\n" +
    "                <cash>\n" +
    "                  <!--1031 Сумма по чеку (БСО) наличными-->\n" +
    "                  <amount>$cAmount$</amount>\n" +
    "                </cash>\n" +
    "                <consideration>\n" +
    "                  <!--1217 Встречное предоставление-->\n" +
    "                  <amount>$considerationAmount$</amount>\n" +
    "                </consideration>\n" +
    "              </forms>\n" +
    "              <total>\n" +
    "                <!--1020 Сумма расчета, указанного в чеке (БСО)-->\n" +
    "                <amount>$tAmount$</amount>\n" +
    "              </total>\n" +
    "            </payments>\n" +
    "            <taxes>$taxes$\n" +
    "            </taxes>\n" +
    "          </$$chequeType$$>\n" +
    "        </cheque>\n" +
    "      </document>\n" +
    "    </sir:issueDocument>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";

  var subjectTemplate = "                <subject>\n" +
    "                  <!--1030 Наименование предмета расчета-->\n" +
    "                  <name>$subjectName$</name>\n" +
    "                  <!--1079 Цена за единицу предмета расчета с Aучетом скидок и наценок-->\n" +
    "                  <price>$subjectPrice$</price>\n" +
    "                  <!--1023 Количество предмета расчета-->\n" +
    "                  <quantity>$subjectQuantity$</quantity>\n" +
    "                  <!--1043 Стоимость предмета расчета с учетом скидок и наценок-->\n" +
    "                  <amount>$subjectAmount$</amount>\n" +
    "                  <!--1197 Eдиница измерения предмета расчета-->\n" +
    "                  <measure>$subjectMeasure$</measure>" +
    "                  <signs>\n" +
    "                    <!--1212 Признак предмета расчета-->\n" +
    "                    <subject codepage=\"fts-1.31_1#type\">$subjectSign$</subject>\n" +
    "                    <!--1214 Признак способа расчета-->\n" +
    "                    <method codepage=\"fts-1.31_1#featureOfSettlementMethod\">$methodSign$</method>\n" +
    "                  </signs>\n" +
    "                  <taxes>\n" +
    "                    <vat>\n" +
    "                      <!--1199 Ставка НДС-->\n" +
    "                      <type codepage=\"fts-1.31_1#vatTaxType\">$subjectVAType$</type>\n" +
    "                      <!--1200 Сумма НДС за предмет расчета-->\n" +
    "                      <amount>$subjectVATAmount$</amount>\n" +
    "                    </vat>\n" +
    "                  </taxes>\n$supplier$$agent$" +
    "                </subject>\n";
  var taxesTemplate = "              <vat>\n" +
    "                <!--18%-->\n" +
    "                <type codepage=\"fts-1.31_1#vatTaxType\">$taxType$</type>\n" +
    "                <!--1102 Сумма НДС чека по ставке 18%-->\n" +
    "                <amount>$taxAmount$</amount>\n" +
    "              </vat>\n";
  var supplierTemplate = "<supplier><name>$name$</name><tin>$tin$</tin></supplier>";
  var agentTemplate = "<agent><roles>$role$</roles></agent>";
  var agentRoles = {
    1: "bankPaymentAgent",
    2: "bankPaymentSubagent",
    4: "paymentAgent",
    8: "paymentSubagent",
    16: "attorney",
    32: "commissionAgent",
    64: "another"
  };
  var supplier = "";
  var agent = "";
  var printoutInjections = "";
  var departmentTemplate = "<subject><department code=\"$code$\" /></subject>\n";
  var document = doc.document;
  var cheque = document.cheque;
  var chequeType = "";
  var chequeContent;
  if (cheque.credit) {
    chequeType = "credit";
    chequeContent = cheque.credit;
  }
  if (cheque.debit) {
    chequeType = "debit";
    chequeContent = cheque.debit;
  }
  if (cheque.creditReturn) {
    chequeType = "creditReturn";
    chequeContent = cheque.creditReturn;
  }
  if (cheque.debitReturn) {
    chequeType = "debitReturn";
    chequeContent = cheque.debitReturn;
  }
  if (doc.chequeType) chequeType = doc.chequeType;
  var subjects = "";
  var taxes = "";
  var items = chequeContent.settlement.subjects.subject;
  var departments = "";
  var i;
  if (items && items.length) {
    for (i = 0; i < items.length; ++i) {
      var item = items[i];
      supplier = "";
      agent = "";
      if (item.agent) {
        var agentRole = item.agent.role;
        if (agentRole && agentRole.$value) agent = agentTemplate.replace("$role$", "<" + agentRoles[+agentRole.$value] + " />");
      }
      if (item.supplier) {
        var subjectSupplier = item.supplier;
        if (subjectSupplier.name || subjectSupplier.tin) {
          supplier = supplierTemplate.replace("$tin$", subjectSupplier.tin).replace("$name$", subjectSupplier.name);
        }
      }
      subjects += subjectTemplate.replace("$subjectName$", mangle(item.name))
        .replace("$subjectPrice$", mangleNumber(item.price))
        .replace("$subjectQuantity$", mangleNumber(item.quantity))
        .replace("$subjectAmount$", mangleNumber(item.amount))
        .replace("$subjectMeasure$", mangle(item.measure))
        .replace("$subjectVAType$", item.taxes.vat[0].type.$value)
        .replace("$subjectVATAmount$", mangleNumber(item.taxes.vat[0].amount))
        .replace("$subjectSign$", mangleNumber(_.get(item.signs, "subject.$value", 1)))
        .replace("$methodSign$", mangleNumber(_.get(item.signs, "method.$value", 4)))
        .replace("$supplier$", supplier)
        .replace("$agent$", agent)
      ;
      departments += departmentTemplate.replace("$code$", item.department || 1)
    }
  }
  var taxArray = _.get(chequeContent, "taxes.vat", []);
  for (i = 0; i < taxArray.length; ++i) {
    taxes += taxesTemplate.replace("$taxType$", taxArray[i].type.$value).replace("$taxAmount$", mangleNumber(taxArray[i].amount));
  }
  var documentReferenceNumber = _.get(doc, "printoutInjections.documentReferenceNumber", "");
  var maskedCardPAN = _.get(doc, "printoutInjections.payments.forms.electronic.maskedCardPAN", "");
  if (documentReferenceNumber.length || maskedCardPAN.length) {
    printoutInjections += "<printoutInjections>";
    if (documentReferenceNumber.length) printoutInjections += "<documentReferenceNumber>" + mangle(documentReferenceNumber) + "</documentReferenceNumber>";
    if (maskedCardPAN.length) printoutInjections += "<payments><forms><electronic><maskedCardPAN>" + mangle(maskedCardPAN) + "</maskedCardPAN></electronic></forms></payments>";
    printoutInjections += "</printoutInjections>";
  }
  var body = bodyTemplate.replace("$id$", doc.attributes.id)
    .replace("$$chequeType$$", chequeType)
    .replace("$$chequeType$$", chequeType)
    .replace("$copies$", doc.copies || 1)
    .replace("$copies$", doc.copies || 1)
    .replace("$taxPayerTIN$", doc.taxPayer.tin)
    .replace("$taxPayerName$", mangle(doc.taxPayer.name))
    .replace("$tin$", cheque.cashier.tin)
    .replace("$fullName$", mangle(cheque.cashier.fullName))
    .replace("$serialNumber$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$vendor$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$address$", mangle(cheque.pointOfSettlement.address))
    .replace("$taxationSystem$", chequeContent.taxationSystem.$value)
    .replace("$phone$", mangle(chequeContent.customer.phone) || "")
    .replace("$email$", mangle(chequeContent.customer.email) || "")
    .replace("$eAmount$", mangleNumber(_.get(chequeContent, "payments.forms.electronic.amount") || ""))
    .replace("$cAmount$", mangleNumber(_.get(chequeContent, "payments.forms.cash.amount") || ""))
    .replace("$considerationAmount$", mangleNumber(_.get(chequeContent, "payments.forms.consideration.amount") || ""))
    .replace("$tAmount$", mangleNumber(_.get(chequeContent, "payments.total.amount") || ""))
    .replace("$responseDelivery$", buildResponseDelivery(doc.instructions.responseDelivery))
    .replace("$subjects$", subjects)
    .replace("$taxes$", taxes)
    .replace("$departments$", departments)
    .replace("$printoutInjections$", printoutInjections)
  ;
  if (doc.instructions.deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$deviceURL$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$exchange$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }

  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    headers: this.getSOAPRequestHeaders(doc.instructions.responseDelivery),
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var status = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:status");
      if (status && status.length) callback(null, {
        status: getTextFromElement(status[0])
      });
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPDocumentsV2.prototype._issueDocumentCorrectionCheque = function (doc, callback) {
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:issueDocument id=\"$id$\">\n" +
    "      <taxPayer>\n" +
    "        <tin>$taxPayerTIN$</tin>\n" +
    "        <name>$taxPayerName$</name>\n" +
    "      </taxPayer>\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$deviceURL$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$exchange$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$serialNumber$</serialNumber>\n" +
    "              <vendor>$vendor$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "        <responseDelivery>\n$responseDelivery$" +
    "        </responseDelivery>\n" +
    "      </instructions>\n" +
    "      <document>\n" +
    "        <!-- tag 1000 -->\n" +
    "        <correctionCheque>\n" +
    "          <copies>$copies$</copies>\n" +
    "          <cashier>\n" +
    "            <!--1021 Кассир-->\n" +
    "            <fullName>$fullName$</fullName>\n" +
    "            <!--1203 ИНН кассира-->\n" +
    "            <tin>$tin$</tin>\n" +
    "          </cashier>\n" +
    "          <pointOfSettlement>\n" +
    "            <!--1009 Адрес расчетов-->\n" +
    "            <address>$address$</address>\n" +
    "          </pointOfSettlement>\n" +
    "          <!--credit debit creditReturn debitReturn tag 1054-->\n" +
    "          <$$chequeType$$>\n" +
    "            <!--1055 Применяемая система налогообложения-->\n" +
    "            <taxationSystem codepage=\"fts-1.31_1#taxationSystem\">$taxationSystem$</taxationSystem>\n" +
    "            <correction>\n" +
    "              <!-- 1173 тип коррекции -->\n" +
    "              <$ownOrForced$ /> <!-- forced -->\n" +
    "              <!-- 1174 основание для коррекции -->\n" +
    "              <reason>\n" +
    "                <!-- 1177 описание коррекции -->\n" +
    "                <description>$correctionReasonDescription$</description>\n" +
    "                <!-- 1178 дата документа основания для коррекции -->\n" +
    "                <date>$correctionReasonDate$</date>\n" +
    "                <!-- 1179 номер документа основания для коррекции -->\n" +
    "                <documentNumber>$correctionReasonDocumentNumber$</documentNumber>\n" +
    "              </reason>\n" +
    "            </correction>" +
    "            <payments>\n" +
    "              <forms>\n" +
    "                <electronic>\n" +
    "                  <!--1031 Сумма по чеку (БСО) наличными-->\n" +
    "                  <amount>$eAmount$</amount>\n" +
    "                </electronic>\n" +
    "                <cash>\n" +
    "                  <!--1031 Сумма по чеку (БСО) наличными-->\n" +
    "                  <amount>$cAmount$</amount>\n" +
    "                </cash>\n" +
    "                <consideration>\n" +
    "                  <!--1217 Встречное предоставление-->\n" +
    "                  <amount>$considerationAmount$</amount>\n" +
    "                </consideration>\n" +
    "              </forms>\n" +
    "              <total>\n" +
    "                <!--1020 Сумма расчета, указанного в чеке (БСО)-->\n" +
    "                <amount>$tAmount$</amount>\n" +
    "              </total>\n" +
    "            </payments>\n" +
    "            <taxes>\n" +
    "              <vat>\n" +
    "                <!--18%-->\n" +
    "                <type codepage=\"fts-1.31_1#vatTaxType\">$taxType$</type>\n" +
    "              </vat>\n" +
    "            </taxes>\n" +
    "          </$$chequeType$$>\n" +
    "        </correctionCheque>\n" +
    "      </document>\n" +
    "    </sir:issueDocument>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var document = doc.document || doc;
  var cheque = document.correctionCheque;
  var chequeType = "";
  var chequeContent;
  if (cheque.credit) {
    chequeType = "credit";
    chequeContent = cheque.credit;
  }
  if (cheque.debit) {
    chequeType = "debit";
    chequeContent = cheque.debit;
  }
  var correction = chequeContent.correction;
  var body = bodyTemplate.replace("$id$", doc.attributes.id)
    .replace("$$chequeType$$", chequeType)
    .replace("$$chequeType$$", chequeType)
    .replace("$ownOrForced$", cheque.ownOrForced)
    .replace("$correctionReasonDescription$", correction.reason.description)
    .replace("$correctionReasonDate$", correction.reason.date)
    .replace("$correctionReasonDocumentNumber$", correction.reason.documentNumber)
    .replace("$copies$", doc.copies || 1)
    .replace("$taxPayerTIN$", doc.taxPayer.tin)
    .replace("$taxPayerName$", mangle(doc.taxPayer.name))
    .replace("$tin$", cheque.cashier.tin)
    .replace("$fullName$", mangle(cheque.cashier.fullName))
    .replace("$serialNumber$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$vendor$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$address$", mangle(cheque.pointOfSettlement.address))
    .replace("$taxationSystem$", cheque.taxationSystem.$value)
    .replace("$eAmount$", _.get(chequeContent, "payments.forms.electronic.amount") || "")
    .replace("$cAmount$", _.get(chequeContent, "payments.forms.cash.amount") || "")
    .replace("$considerationAmount$", _.get(chequeContent, "payments.forms.consideration.amount") || "")
    .replace("$tAmount$", (_.get(chequeContent, "payments.forms.electronic.amount") || 0) + (_.get(chequeContent, "payments.forms.cash.amount") || 0))
    .replace("$responseDelivery$", buildResponseDelivery(doc.instructions.responseDelivery))
    .replace("$taxType$", chequeContent.taxes.vat[0].type.$value)
  ;
  if (doc.instructions.deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$deviceURL$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$exchange$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    headers: this.getSOAPRequestHeaders(doc.instructions.responseDelivery),
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var status = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:status");
      if (status && status.length) callback(null, {
        status: getTextFromElement(status[0])
      });
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPDocumentsV2.prototype._issueDocumentOpenShift = function (doc, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:issueDocument id=\"$id$\">\n" +
    "      <taxPayer>\n" +
    "        <!-- tag 1018 ИНН пользователя -->\n" +
    "        <tin>$taxPayerTIN$</tin>\n" +
    "\n" +
    "        <!-- tag 1048 Наименование пользователя -->\n" +
    "        <name>$taxPayerName$</name>\n" +
    "      </taxPayer>\n" +
    "\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$url$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$exchange$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$serialNumber$</serialNumber>\n" +
    "              <vendor>$vendor$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "        <responseDelivery>\n$responseDelivery$" +
    "        </responseDelivery>\n" +
    "      </instructions>\n" +
    "\n" +
    "      <document>\n" +
    "        <!-- tag 1000 -->\n" +
    "        <openShiftReport>\n" +
    "          <cashier>\n" +
    "            <!--1021 Кассир-->\n" +
    "            <fullName>$name$</fullName>\n" +
    "\n" +
    "            <!--1203 ИНН кассира-->\n" +
    "            <tin>$tin$</tin>\n" +
    "          </cashier>\n" +
    "        </openShiftReport>\n" +
    "      </document>\n" +
    "    </sir:issueDocument>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";

  var body = bodyTemplate.replace("$id$", doc.attributes.id)
    .replace("$taxPayerTIN$", doc.taxPayer.tin)
    .replace("$taxPayerName$", doc.taxPayer.name)
    .replace("$tin$", doc.document.openShiftReport.cashier.tin)
    .replace("$name$", doc.document.openShiftReport.cashier.fullName)
    .replace("$serialNumber$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$vendor$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$responseDelivery$", buildResponseDelivery(doc.instructions.responseDelivery));
  if (doc.instructions.deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$url$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$exchange$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    headers: this.getSOAPRequestHeaders(doc.instructions.responseDelivery),
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var status = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:status");
      if (status && status.length) callback(null, {
        status: getTextFromElement(status[0])
      });
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPDocumentsV2.prototype._issueDocumentCloseShift = function (doc, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:issueDocument id=\"$id$\">\n" +
    "      <taxPayer>\n" +
    "        <!-- tag 1018 ИНН пользователя -->\n" +
    "        <tin>$taxPayerTIN$</tin>\n" +
    "\n" +
    "        <!-- tag 1048 Наименование пользователя -->\n" +
    "        <name>$taxPayerName$</name>\n" +
    "      </taxPayer>\n" +
    "\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$url$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$exchange$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$serialNumber$</serialNumber>\n" +
    "              <vendor>$vendor$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "        <responseDelivery>\n$responseDelivery$" +
    "        </responseDelivery>\n" +
    "      </instructions>\n" +
    "\n" +
    "      <document>\n" +
    "        <!-- tag 1000 -->\n" +
    "        <closeShiftReport>\n" +
    "          <cashier>\n" +
    "            <!--1021 Кассир-->\n" +
    "            <fullName>$name$</fullName>\n" +
    "\n" +
    "            <!--1203 ИНН кассира-->\n" +
    "            <tin>$tin$</tin>\n" +
    "          </cashier>\n" +
    "        </closeShiftReport>\n" +
    "      </document>\n" +
    "    </sir:issueDocument>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";

  var body = bodyTemplate.replace("$id$", doc.attributes.id)
    .replace("$taxPayerTIN$", doc.taxPayer.tin)
    .replace("$taxPayerName$", doc.taxPayer.name)
    .replace("$tin$", doc.document.closeShiftReport.cashier.tin)
    .replace("$name$", doc.document.closeShiftReport.cashier.fullName)
    .replace("$serialNumber$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$vendor$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$responseDelivery$", buildResponseDelivery(doc.instructions.responseDelivery));
  if (doc.instructions.deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$url$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$exchange$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    headers: this.getSOAPRequestHeaders(doc.instructions.responseDelivery),
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var status = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:status");
      if (status && status.length) callback(null, {
        status: getTextFromElement(status[0])
      });
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPDocumentsV2.prototype._issueDocumentCurrentSettlementReport = function (doc, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:issueDocument id=\"$id$\">\n" +
    "      <taxPayer>\n" +
    "        <!-- tag 1018 ИНН пользователя -->\n" +
    "        <tin>$taxPayerTIN$</tin>\n" +
    "\n" +
    "        <!-- tag 1048 Наименование пользователя -->\n" +
    "        <name>$taxPayerName$</name>\n" +
    "      </taxPayer>\n" +
    "\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$url$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$exchange$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$serialNumber$</serialNumber>\n" +
    "              <vendor>$vendor$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "        <responseDelivery>\n$responseDelivery$" +
    "        </responseDelivery>\n" +
    "      </instructions>\n" +
    "\n" +
    "      <document>\n" +
    "        <!-- tag 1000 -->\n" +
    "        <currentSettlementReport />\n" +
    "      </document>\n" +
    "    </sir:issueDocument>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";

  var body = bodyTemplate.replace("$id$", doc.attributes.id)
    .replace("$taxPayerTIN$", doc.taxPayer.tin)
    .replace("$taxPayerName$", doc.taxPayer.name)
    .replace("$serialNumber$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$vendor$", doc.instructions.deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$responseDelivery$", buildResponseDelivery(doc.instructions.responseDelivery));
  if (doc.instructions.deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$url$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$exchange$", doc.instructions.deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    headers: this.getSOAPRequestHeaders(doc.instructions.responseDelivery),
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var status = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:status");
      if (status && status.length) callback(null, {
        status: getTextFromElement(status[0])
      });
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPDocumentsV2.prototype.setup = function (callback) {
  callback(null);
};

SOAPRoutingStatusV1.prototype.deviceRouteStatus = function (deviceRouting, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    '    <sir:deviceRouteStatus id="$id$">\n' +
    "      <cashRegistersService>\n" +
    "        <messagingBroker>\n" +
    "          <url>$AMQP_URL$</url>\n" +
    "          <amqp>\n" +
    "            <exchange>$AMQP_EXCHANGE$</exchange>\n" +
    "          </amqp>\n" +
    "        </messagingBroker>\n" +
    "        <cashRegister>\n" +
    "          <serialNumber>$SERIAL$</serialNumber>\n" +
    "          <vendor>$VENDOR$</vendor>\n" +
    "        </cashRegister>\n" +
    "      </cashRegistersService>\n" +
    "    </sir:deviceRouteStatus>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var body = bodyTemplate.replace("$SERIAL$", deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$VENDOR$", deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$id$", moment().format("YYYYMMDDHHmmssSSS"));
  if (deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$AMQP_URL$", deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$AMQP_EXCHANGE$", deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    data: body,
    success: function (res) {
      var i;
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var single = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:deviceRouteStatusResponse")[0]
        .getElementsByTagName("single")[0];
      if (!single) return callback({
        description: "No single in response"
      });
      var turnOnNotCompletedBecauseShiftCloseRequired = single.getElementsByTagName("turnOnNotCompletedBecauseShiftCloseRequired");
      if (turnOnNotCompletedBecauseShiftCloseRequired) turnOnNotCompletedBecauseShiftCloseRequired = turnOnNotCompletedBecauseShiftCloseRequired[0];
      if (turnOnNotCompletedBecauseShiftCloseRequired) turnOnNotCompletedBecauseShiftCloseRequired = true;
      var allowedOperationsX = single.getElementsByTagName("allowedOperations")[0];
      var issueDocuments = {};
      var allowedOperations = {
        issueDocuments: issueDocuments
      };
      var departments = [];
      var availableServices = {
        issueDocuments: {
          soap: {
            service: {
              url: ""
            }
          }
        },
        operations: {
          soap: {
            service: {
              url: ""
            }
          }
        },
        subjectsEditor: {
          soap: {
            service: {
              url: ""
            }
          },
          web: {
            site: {
              url: ""
            }
          }
        },
        responseDeliveryGateway: {
          socketio: {
            service: {
              url: "",
              path: "",
              namespace: ""
            }
          }
        }
      };
      var availableServicesX = single.getElementsByTagName("availableServices")[0];
      if (availableServicesX) {
        var a = availableServicesX.getElementsByTagName("issueDocuments")[0];
        if (a) availableServices.issueDocuments.soap.service.url = getTextFromElement(a.getElementsByTagName("url"));
        a = availableServicesX.getElementsByTagName("operations")[0];
        if (a) availableServices.operations.soap.service.url = getTextFromElement(a.getElementsByTagName("url"));
        a = availableServicesX.getElementsByTagName("subjectsEditor")[0];
        if (a) {
          var b = a.getElementsByTagName("soap")[0];
          var c = a.getElementsByTagName("web")[0];
          availableServices.subjectsEditor.soap.service.url = getTextFromElement(b.getElementsByTagName("url"));
          availableServices.subjectsEditor.web.site.url = getTextFromElement(c.getElementsByTagName("url"));
        }
        a = availableServicesX.getElementsByTagName("responseDeliveryGateway")[0];
        if (a) {
          availableServices.responseDeliveryGateway.socketio.service.url = getTextFromElement(a.getElementsByTagName("url"));
          availableServices.responseDeliveryGateway.socketio.service.path = getTextFromElement(a.getElementsByTagName("path"));
          availableServices.responseDeliveryGateway.socketio.service.namespace = getTextFromElement(a.getElementsByTagName("namespace"));
        }
      }
      if (allowedOperationsX) {
        var allowedOperationsEncashment = allowedOperationsX.getElementsByTagName("encashment")[0] ? {} : undefined;
        var allowedOperationsRefill = allowedOperationsX.getElementsByTagName("refill")[0] ? {} : undefined;
        var allowedOperationsFlowStatementsReport = allowedOperationsX.getElementsByTagName("flowStatementsReport")[0] ? {} : undefined;
        var issueDocumentsX = allowedOperationsX.getElementsByTagName("issueDocuments")[0];
        if (issueDocumentsX) {
          var issueDocumentsOpenShift = issueDocumentsX.getElementsByTagName("openShift")[0] ? {} : undefined;
          var issueDocumentsXCloseShift = issueDocumentsX.getElementsByTagName("closeShift")[0];
          var issueDocumentsCloseShift = issueDocumentsXCloseShift ? {} : undefined;
          if (issueDocumentsXCloseShift && issueDocumentsXCloseShift.getElementsByTagName("shiftExpired")[0]) issueDocumentsCloseShift.shiftExpired = {};
          var issueDocumentsCheque = issueDocumentsX.getElementsByTagName("cheque")[0] ? {} : undefined;
          var issueDocumentsCorrectionCheque = issueDocumentsX.getElementsByTagName("correctionCheque")[0] ? {} : undefined;
          var issueDocumentsCurrentSettlementReport = issueDocumentsX.getElementsByTagName("currentSettlementReport")[0] ? {} : undefined;
          if (issueDocumentsOpenShift) issueDocuments.openShift = issueDocumentsOpenShift;
          if (issueDocumentsCloseShift) issueDocuments.closeShift = issueDocumentsCloseShift;
          if (issueDocumentsCheque) {
            issueDocuments.cheque = issueDocumentsCheque;
            var issueChequeX = issueDocumentsX.getElementsByTagName("cheque")[0];
            if (issueChequeX.getElementsByTagName("credit")[0]) issueDocumentsCheque.credit = {};
            if (issueChequeX.getElementsByTagName("debit")[0]) issueDocumentsCheque.debit = {};
            if (issueChequeX.getElementsByTagName("creditReturn")[0]) issueDocumentsCheque.creditReturn = {};
            if (issueChequeX.getElementsByTagName("debitReturn")[0]) issueDocumentsCheque.debitReturn = {};
          }
          if (issueDocumentsCorrectionCheque) {
            issueDocuments.correctionCheque = issueDocumentsCorrectionCheque;
            var issueCorrectionChequeX = issueDocumentsX.getElementsByTagName("correctionCheque")[0];
            if (issueCorrectionChequeX.getElementsByTagName("credit")[0]) issueDocumentsCorrectionCheque.credit = {};
            if (issueCorrectionChequeX.getElementsByTagName("debit")[0]) issueDocumentsCorrectionCheque.debit = {};
          }
          if (issueDocumentsCurrentSettlementReport) issueDocuments.currentSettlementReport = issueDocumentsCurrentSettlementReport;
        }
        if (allowedOperationsEncashment) allowedOperations.encashment = allowedOperationsEncashment;
        if (allowedOperationsRefill) allowedOperations.refill = allowedOperationsRefill;
        if (allowedOperationsFlowStatementsReport) allowedOperations.flowStatementsReport = allowedOperationsFlowStatementsReport;
        var failX = single.getElementsByTagName("fail")[0];
        if (failX) {
          return callback(null, {
            single: {
              allowedOperations: allowedOperations,
              availableServices: availableServices,
              fail: {
                code: getTextFromElement(failX.getElementsByTagName("code")[0]),
                description: getTextFromElement(failX.getElementsByTagName("description")[0]) + ". Case: " + getTextFromElement(failX.getElementsByTagName("uuid")[0])
              }
            }
          });
        }
        var currentShift = single.getElementsByTagName("currentShift");
        if (currentShift && currentShift.length) currentShift = currentShift[0];
        else
          return callback(null, {
            single: {
              allowedOperations: allowedOperations,
              availableServices: availableServices
            }
          });
        var openShiftReport = currentShift.getElementsByTagName("openShiftReport")[0];
        var shift = openShiftReport.getElementsByTagName("shift")[0];
        var cashRegister = openShiftReport.getElementsByTagName("cashRegister")[0];
        var currentRegistrationX = single.getElementsByTagName("currentRegistration")[0];
        var currentRegistration = {};
        if (currentRegistrationX) {
          var registrationReport = {};
          currentRegistration.registrationReport = registrationReport;
          var registrationReportX = currentRegistrationX.getElementsByTagName("registrationReport")[0];
          var taxationSystems = {};
          var taxationSystem = [];
          registrationReport.taxationSystems = taxationSystems;
          taxationSystems.taxationSystem = taxationSystem;
          if (registrationReportX) {
            var taxationSystemsX = registrationReportX.getElementsByTagName("taxationSystem");
            i = 0;
            for (i = 0; i < taxationSystemsX.length; ++i) {
              var systemX = taxationSystemsX[i];
              taxationSystem.push({
                attributes: {codepage: systemX.getAttribute("codepage")},
                $value: getNumberFromElement(systemX)
              });
            }
            var taxPayerX = registrationReportX.getElementsByTagName("taxPayer");
            if (taxPayerX) {
              var tin = getTextFromElement(taxPayerX[0].getElementsByTagName("tin"));
              var name = getTextFromElement(taxPayerX[0].getElementsByTagName("name"));
              if (tin && name) {
                registrationReport.taxPayer = {
                  tin: tin,
                  name: name
                };
              }
            }
            var pointOfSettlementX = registrationReportX.getElementsByTagName("pointOfSettlement");
            if (pointOfSettlementX) {
              var address = getTextFromElement(pointOfSettlementX[0].getElementsByTagName("address"));
              if (address) registrationReport.pointOfSettlement = {
                address: address
              };
            }
            var agentModeX = registrationReportX.getElementsByTagName("agentMode");
            if (agentModeX && agentModeX[0]) {
              var agentModeRolesX = agentModeX[0].getElementsByTagName("roles");
              if (agentModeRolesX && agentModeRolesX[0]) {
                var agentModeRoles = {};
                registrationReport.agent = {roles: agentModeRoles};
                if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName("bankPaymentAgent"))) agentModeRoles.bankPaymentAgent = true;
                if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName("bankPaymentSubagent"))) agentModeRoles.bankPaymentSubagent = true;
                if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName("paymentAgent"))) agentModeRoles.paymentAgent = true;
                if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName("paymentSubagent"))) agentModeRoles.paymentSubagent = true;
                if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName("attorney"))) agentModeRoles.attorney = true;
                if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName("commissionAgent"))) agentModeRoles.commissionAgent = true;
                if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName("another"))) agentModeRoles.another = true;
              }
            }
          }
        }
        var printoutCopies = {};
        var supportedExtensionsX = single.getElementsByTagName("supportedExtensions");
        if (supportedExtensionsX && supportedExtensionsX[0]) {
          var departmentsX = supportedExtensionsX[0].getElementsByTagName("departments");
          if (departmentsX && departmentsX[0]) {
            var departmentX = departmentsX[0].getElementsByTagName("department");
            for (i = 0; i < departmentX.length; ++i) {
              var dcode = getTextFromElement(departmentX[i].getElementsByTagName("code"));
              var dname = getTextFromElement(departmentX[i].getElementsByTagName("title"));
              if (!dname) dname = getTextFromElement(departmentX[i].getElementsByTagName("name"));
              departments.push({
                code: dcode,
                name: dname
              })
            }
          }
          var printoutCopiesX = supportedExtensionsX[0].getElementsByTagName("printoutCopies");
          if (printoutCopiesX && printoutCopiesX[0]) {
            var iDocumentsX = printoutCopiesX[0].getElementsByTagName("issueDocuments")[0];
            if (iDocumentsX) {
              iDocumentsCheque = iDocumentsX.getElementsByTagName("cheque")[0] ? {} : undefined;
              if (iDocumentsCheque) {
                var iChequeX = iDocumentsX.getElementsByTagName("cheque")[0];
                if (iChequeX.getElementsByTagName("credit")[0]) iDocumentsCheque.credit = {};
                if (iChequeX.getElementsByTagName("debit")[0]) iDocumentsCheque.debit = {};
                if (iChequeX.getElementsByTagName("creditReturn")[0]) iDocumentsCheque.creditReturn = {};
                if (iChequeX.getElementsByTagName("debitReturn")[0]) iDocumentsCheque.debitReturn = {};
                printoutCopies.issueDocuments = {
                  cheque: iDocumentsCheque
                }
              }
            }
          }
        }
      }
      var resp = {
        single: {
          currentShift: {
            openShiftReport: {
              shift: {
                number: getTextFromElement(shift.getElementsByTagName("number")[0])
              },
              fiscalNumber: getTextFromElement(openShiftReport.getElementsByTagName("fiscalNumber")[0]),
              fiscalSignature: getTextFromElement(openShiftReport.getElementsByTagName("fiscalSignature")[0]),
              cashRegister: {
                authority: {
                  registrationNumber: getTextFromElement(cashRegister.getElementsByTagName("authority")[0].getElementsByTagName("registrationNumber")[0])
                },
                fiscalStorage: {
                  factoryNumber: getTextFromElement(cashRegister.getElementsByTagName("fiscalStorage")[0].getElementsByTagName("factoryNumber")[0])
                },
                factoryNumber: getTextFromElement(cashRegister.getElementsByTagName("factoryNumber")[0])
              }
            }
          },
          currentRegistration: currentRegistration,
          allowedOperations: allowedOperations,
          departments: departments,
          printoutCopies: printoutCopies,
          availableServices: availableServices
        }
      };
      // TODO Добавить вывод даты, фискального ид и фискального признака
      if (turnOnNotCompletedBecauseShiftCloseRequired) resp.single.turnOnNotCompletedBecauseShiftCloseRequired = true;
      return callback(null, resp);
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPRoutingStatusV1.prototype.setup = function (callback) {
  callback(null);
};

SOAPOperationsV1.prototype.setup = function (callback) {
  callback(null);
};

SOAPOperationsV1.prototype.encashment = function (deviceRouting, request, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:encashment id=\"$id$\">\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$AMQP_URL$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$AMQP_EXCHANGE$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$SERIAL$</serialNumber>\n" +
    "              <vendor>$VENDOR$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "      </instructions>\n" +
    "      <options>\n" +
    "        <amount>$AMOUNT$</amount>\n" +
    "        <operatorName>$OPERATORNAME$</operatorName>\n" +
    "      </options>\n" +
    "    </sir:encashment>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var body = bodyTemplate.replace("$SERIAL$", deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$VENDOR$", deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$AMOUNT$", request.amount)
    .replace("$OPERATORNAME$", request.operatorName || "")
    .replace("$id$", moment().format("YYYYMMDDHHmmssSSS"));
  if (deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$AMQP_URL$", deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$AMQP_EXCHANGE$", deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var response = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:encashmentResponse")[0];
      if (!response) return callback({
        description: "No response"
      });
      var resp = {
        amountBefore: getNumberFromElement(response.getElementsByTagName("amountBefore")[0]),
        amountAfter: getNumberFromElement(response.getElementsByTagName("amountAfter")[0])
      };
      return callback(null, resp);
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPOperationsV1.prototype.refill = function (deviceRouting, request, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:refill id=\"$id$\">\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$AMQP_URL$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$AMQP_EXCHANGE$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$SERIAL$</serialNumber>\n" +
    "              <vendor>$VENDOR$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "      </instructions>\n" +
    "      <options>\n" +
    "        <amount>$AMOUNT$</amount>\n" +
    "        <operatorName>$OPERATORNAME$</operatorName>\n" +
    "      </options>\n" +
    "    </sir:refill>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var body = bodyTemplate.replace("$SERIAL$", deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$VENDOR$", deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$AMOUNT$", request.amount)
    .replace("$OPERATORNAME$", request.operatorName || "")
    .replace("$id$", moment().format("YYYYMMDDHHmmssSSS"));
  if (deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$AMQP_URL$", deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$AMQP_EXCHANGE$", deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var response = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:refillResponse")[0];
      if (!response) return callback({
        description: "No response"
      });
      var resp = {
        amountBefore: getNumberFromElement(response.getElementsByTagName("amountBefore")[0]),
        amountAfter: getNumberFromElement(response.getElementsByTagName("amountAfter")[0])
      };
      return callback(null, resp);
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPOperationsV1.prototype.flowStatementReport = function (deviceRouting, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:flowStatementReport id=\"$id$\">\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$AMQP_URL$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$AMQP_EXCHANGE$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$SERIAL$</serialNumber>\n" +
    "              <vendor>$VENDOR$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "      </instructions>\n" +
    "    </sir:flowStatementReport>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var body = bodyTemplate.replace("$SERIAL$", deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$VENDOR$", deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$id$", moment().format("YYYYMMDDHHmmssSSS"));
  if (deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$AMQP_URL$", deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$AMQP_EXCHANGE$", deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var response = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:flowStatementReportResponse")[0];
      if (!response) return callback({
        description: "No response"
      });
      var resp = {};
      return callback(null, resp);
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPOperationsV1.prototype.turnOn = function (deviceRouting, callback) {
  var self = this;
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:turnOn id=\"$id$\">\n" +
    "      <instructions>\n" +
    "        <deviceRouting>\n" +
    "          <cashRegistersService>\n" +
    "            <messagingBroker>\n" +
    "              <url>$AMQP_URL$</url>\n" +
    "              <amqp>\n" +
    "                <exchange>$AMQP_EXCHANGE$</exchange>\n" +
    "              </amqp>\n" +
    "            </messagingBroker>\n" +
    "            <cashRegister>\n" +
    "              <serialNumber>$SERIAL$</serialNumber>\n" +
    "              <vendor>$VENDOR$</vendor>\n" +
    "            </cashRegister>\n" +
    "          </cashRegistersService>\n" +
    "        </deviceRouting>\n" +
    "      </instructions>\n" +
    "    </sir:turnOn>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var body = bodyTemplate.replace("$SERIAL$", deviceRouting.cashRegistersService.cashRegister.serialNumber)
    .replace("$VENDOR$", deviceRouting.cashRegistersService.cashRegister.vendor)
    .replace("$id$", moment().format("YYYYMMDDHHmmssSSS"));
  if (deviceRouting.cashRegistersService.messagingBroker) {
    body = body.replace("$AMQP_URL$", deviceRouting.cashRegistersService.messagingBroker.url)
      .replace("$AMQP_EXCHANGE$", deviceRouting.cashRegistersService.messagingBroker.amqp.exchange);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var response = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:turnOnResponse")[0];
      if (!response) return callback({
        description: "No response"
      });
      var resp = {};
      return callback(null, resp);
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPSubjectsV1.prototype.setup = function (callback) {
  callback(null);
};

SOAPSubjectsV1.prototype.fetchSubjects = function (deviceRouting, callback) {
  var self = this;
  var bodyTemplateCR = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:fetchSubjectsList>\n" +
    "      <subjectsListIdentification>\n" +
    "        <cashRegister>\n" +
    "          <serialNumber>$SERIAL$</serialNumber>\n" +
    "          <vendor>$VENDOR$</vendor>\n" +
    "        </cashRegister>\n" +
    "      </subjectsListIdentification>\n" +
    "    </sir:fetchSubjectsList>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var bodyTemplateGUID = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:fetchSubjectsList>\n" +
    "      <subjectsListIdentification>\n" +
    "        <identification>\n" +
    "          <guid>$guid$</guid>\n" +
    "        </identification>\n" +
    "      </subjectsListIdentification>\n" +
    "    </sir:fetchSubjectsList>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var body;
  if (deviceRouting.cashRegistersService) {
    body = bodyTemplateCR.replace("$SERIAL$", deviceRouting.cashRegistersService.cashRegister.serialNumber)
      .replace("$VENDOR$", deviceRouting.cashRegistersService.cashRegister.vendor);
  } else {
    body = bodyTemplateGUID.replace("$guid$", deviceRouting);
  }
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var subjectsList = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("soap:Body")[0]
        .getElementsByTagName("tns:fetchSubjectsListResponse")[0]
        .getElementsByTagName("subjectsList")[0];
      if (!subjectsList) return callback({
        description: "No subjectsList in response"
      });
      var identification = getTextFromElement(subjectsList.getElementsByTagName("guid")[0]);
      var subjects = [];
      var subjectX = subjectsList.getElementsByTagName("subject");
      var i;
      for (i = 0; i < subjectX.length; ++i) {
        var sX = subjectX[i];
        var nameX = sX.getElementsByTagName("name")[0];
        if (!nameX) continue;
        var s = {
          name: getTextFromElement(nameX),
          price: getTextFromElement(sX.getElementsByTagName("price")),
          quantity: getTextFromElement(sX.getElementsByTagName("quantity")),
          measure: getTextFromElement(sX.getElementsByTagName("measure"))
        };
        var departmentX = sX.getElementsByTagName("department")[0];
        if (departmentX) {
          var department = {
            code: getTextFromElement(departmentX.getElementsByTagName("code")),
            title: getTextFromElement(departmentX.getElementsByTagName("title"))
          };
          s.department = department;
          s.departmentCode = department.code;
        }
        var taxesX = sX.getElementsByTagName("taxes")[0];
        if (taxesX) {
          var type = getTextFromElement(taxesX.getElementsByTagName("type")[0]);
          s.taxes = {
            vat: [{
              amount: 0,
              type: {
                $value: type,
                attributes: {
                  codepage: "fts-1.31_1#vatTaxType"
                }
              }
            }]
          };
        }
        var agentX = sX.getElementsByTagName("agent")[0];
        if (agentX) {
          var role = getTextFromElement(agentX.getElementsByTagName("role")[0]);
          s.agent = {
            role: {
              $value: +role,
              attributes: {
                codepage: "fts-1.31_1#agentMode"
              }
            }
          };
          var supplierX = sX.getElementsByTagName("supplier")[0];
          if (supplierX) {
            s.supplier = {
              name: getTextFromElement(supplierX.getElementsByTagName("name")[0]),
              tin: getTextFromElement(supplierX.getElementsByTagName("tin")[0])
            }
          }
        }
        var signsX = sX.getElementsByTagName("signs")[0];
        if (signsX) {
          var subjX = signsX.getElementsByTagName("subject")[0];
          var methX = signsX.getElementsByTagName("method")[0];
          s.signs = {
            subject: {
              attributes: {
                codepage: "fts-1.31_1#type"
              },
              $value: subjX && getTextFromElement(subjX) || 1
            },
            method: {
              attributes: {
                codepage: "fts-1.31_1#featureOfSettlementMethod"
              },
              $value: methX && getTextFromElement(methX) || 4
            }
          };
        }
        var restrictionsX = sX.getElementsByTagName("restrictions")[0];
        if (restrictionsX) {
          var ts = restrictionsX.getElementsByTagName("taxationSystem");
          var j;
          for (j = 0; j < ts.length; ++j) {
            if (!s.restrictions) s.restrictions = {
              taxationSystems: {
                taxationSystem: []
              }
            };
            s.restrictions.taxationSystems.taxationSystem.push({
              type: {
                $value: getTextFromElement(ts[j].getElementsByTagName("type")[0]),
                attributes: {
                  codepage: "fts-1.31_1#taxationSystem"
                }
              }
            });
          }
        }
        subjects.push(s);
      }
      var resp = {
        identification: {
          guid: identification
        },
        subjects: subjects
      };
      return callback(null, resp);
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};

SOAPSubjectsV1.prototype.commitSubjects = function (deviceRouting, subjects, callback) {
  var self = this;
  var restrictionTemplate = "                  <taxationSystem>\n" +
    "                    <type codepage=\"fts-1.31_1#taxationSystem\">$type$</type>\n" +
    "                  </taxationSystem>\n";
  var restrictionsTemplate = "              <restrictions>\n" +
    "                <taxationSystems>\n$taxationSystems$" +
    "                </taxationSystems>\n" +
    "              </restrictions>\n";
  var departmentTemplate = "              <department>\n" +
    "                <code>$code$</code>\n" +
    "                <title>$title$</title>\n" +
    "              </department>\n";
  var subjectTemplate = "            <subject>\n" +
    "              <name>$name$</name>\n" +
    "              <price>$price$</price>\n" +
    "              <quantity>$quantity$</quantity>\n" +
    "              <measure>$measure$</measure>\n" +
    "              <signs>\n" +
    "                <!--1212 Признак предмета расчета-->\n" +
    "                <subject codepage=\"fts-1.31_1#type\">$subjectSign$</subject>\n" +
    "                <!--1214 Признак способа расчета-->\n" +
    "                <method codepage=\"fts-1.31_1#featureOfSettlementMethod\">$methodSign$</method>\n" +
    "              </signs>\n" +
    "              <taxes>\n" +
    "                <tax>\n" +
    "                  <vat>\n" +
    "                    <type codepage=\"fts-1.31_1#vatTaxType\">$type$</type>\n" +
    "                  </vat>\n" +
    "                </tax>\n" +
    "              </taxes>\n$restrictions$$department$$supplier$$agent$" +
    "            </subject>\n";
  var bodyTemplate = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sir=\"http://sirena-travel.ru\">\n" +
    "  <soapenv:Header />\n" +
    "  <soapenv:Body>\n" +
    "    <sir:commitSubjectsList>\n" +
    "      <subjectsList>\n" +
    "        <identification>\n" +
    "          <guid>$guid$</guid>\n" +
    "        </identification>\n" +
    "        <fullSnapshot>\n" +
    "          <subjects>\n$subjects$" +
    "          </subjects>\n" +
    "        </fullSnapshot>\n" +
    "      </subjectsList>\n" +
    "    </sir:commitSubjectsList>\n" +
    "  </soapenv:Body>\n" +
    "</soapenv:Envelope>\n";
  var supplierTemplate = "<supplier><name>$name$</name><tin>$tin$</tin></supplier>";
  var agentTemplate = "<agent><role codepage=\"fts-1.31_1#agentMode\">$role$</role></agent>";
  var ss = "";
  var i;
  for (i = 0; i < subjects.length; ++i) {
    var s = subjects[i];
    var rr = "";
    var supplier = "";
    var agent = "";
    var department = "";
    var restrictions = s.restrictions;
    if (restrictions && restrictions.taxationSystems && restrictions.taxationSystems.taxationSystem) {
      var j;
      for (j = 0; j < restrictions.taxationSystems.taxationSystem.length; ++j) {
        rr += restrictionTemplate.replace("$type$", restrictions.taxationSystems.taxationSystem[j].type.$value);
      }
      rr = restrictionsTemplate.replace("$taxationSystems$", rr);
    }
    if (s.department) {
      department = departmentTemplate.replace("$code$", s.department.code).replace("$title$", s.department.title);
    }
    supplier = "";
    agent = "";
    if (s.agent) {
      var agentRole = s.agent.role;
      if (agentRole && agentRole.$value) agent = agentTemplate.replace("$role$", agentRole.$value);
    }
    if (s.supplier) {
      var subjectSupplier = s.supplier;
      if (subjectSupplier.name || subjectSupplier.tin) {
        supplier = supplierTemplate.replace("$tin$", subjectSupplier.tin).replace("$name$", subjectSupplier.name);
      }
    }
    ss += subjectTemplate.replace("$name$", mangle(s.name))
      .replace("$name$", mangle(s.name))
      .replace("$price$", mangle(s.price))
      .replace("$quantity$", mangle(s.quantity))
      .replace("$measure$", mangle(s.measure))
      .replace("$type$", mangle(s.taxes ? s.taxes.vat[0].type.$value : ""))
      .replace("$restrictions$", rr)
      .replace("$subjectSign$", mangleNumber(_.get(s.signs, "subject.$value", 1)))
      .replace("$methodSign$", mangleNumber(_.get(s.signs, "method.$value", 4)))
      .replace("$department$", department)
      .replace("$supplier$", supplier)
      .replace("$agent$", agent)
    ;
  }
  var body = bodyTemplate.replace("$guid$", deviceRouting)
    .replace("$subjects$", ss);
  $.ajax({
    url: this.endpoint,
    dataType: "xml",
    method: "POST",
    data: body,
    success: function (res) {
      var fault = getFaultFromResponse(res);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(res);
      if (error) return callback(error);
      var status = res.getElementsByTagName("soap:Envelope")[0]
        .getElementsByTagName("tns:status");
      if (status && status.length) callback(null, {
        status: getTextFromElement(status[0])
      });
    },
    error: function (a, b, c) {
      var x = stringToXMLDom(a.responseText);
      var fault = getFaultFromResponse(x);
      if (fault) return callback(fault);
      var error = getErrorFromResponse(x);
      if (error) return callback(error);
    }
  });
};
