export const singleMockDataXML = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tns="http://sirena-travel.ru">
    <soap:Body>
        <tns:deviceRouteStatusResponse>
            <single>
                <currentShift>
                    <openShiftReport>
                        <shift>
                            <number>21</number>
                        </shift>
                        <dateTime />
                        <fiscalNumber>58</fiscalNumber>
                        <fiscalSignature>76901938</fiscalSignature>
                        <cashRegister>
                            <authority>
                                <registrationNumber>7049400025059324</registrationNumber>
                            </authority>
                            <factoryNumber>7575757575757575</factoryNumber>
                            <fiscalStorage>
                                <factoryNumber>7575757575757575</factoryNumber>
                                <workMode>
                                    <encryptMode>false</encryptMode>
                                    <autonomousMode>false</autonomousMode>
                                    <autoMode>false</autoMode>
                                    <serviceIndustriesMode>false</serviceIndustriesMode>
                                    <fsrMode>false</fsrMode>
                                    <internetMode>false</internetMode>
                                    <exciseMode>false</exciseMode>
                                    <gamblingMode>false</gamblingMode>
                                    <lotteryMode>false</lotteryMode>
                                    <automationMode>false</automationMode>
                                    <fiscalDocumentFormatVersion>1.05</fiscalDocumentFormatVersion>
                                </workMode>
                            </fiscalStorage>
                        </cashRegister>
                    </openShiftReport>
                </currentShift>
                <currentRegistration>
                    <registrationReport>
                        <taxPayer>
                            <tin>7734473613</tin>
                            <name>МИКСВЕЛ</name>
                        </taxPayer>
                        <pointOfSettlement>
                            <address>г Москва, Шелепихинская наб, д 34 к 3, кв 420</address>
                        </pointOfSettlement>
                        <cashier>
                            <tin>7734473613</tin>
                            <fullName>МИКСВЕЛ</fullName>
                        </cashier>
                        <authority>
                            <site>www.nalog.gov.ru</site>
                        </authority>
                        <chequeSenderEMail>noreply@taxcom.ru</chequeSenderEMail>
                        <taxationSystems>
                            <taxationSystem codepage="fts-1.31_1">0</taxationSystem>
                        </taxationSystems>
                    </registrationReport>
                </currentRegistration>
                <availableServices>
                    <issueDocuments>
                        <soap>
                            <service>
                                <url>https://taxserver.sirena-travel.ru/fh/documents/v2</url>
                            </service>
                        </soap>
                    </issueDocuments>
                    <operations>
                        <soap>
                            <service>
                                <url>https://taxserver.sirena-travel.ru/fh/operations/v1</url>
                            </service>
                        </soap>
                    </operations>
                    <subjectsEditor>
                        <soap>
                            <service>
                                <url>https://taxserver.sirena-travel.ru/fh/subjects/v1</url>
                            </service>
                        </soap>
                        <web>
                            <site>
                                <url>https://taxserver.sirena-travel.ru/fh/subjects/index.html?guid=$guid$&amp;token=JTVCJTVE</url>
                            </site>
                        </web>
                    </subjectsEditor>
                    <responseDeliveryGateway>
                        <socketio>
                            <service>
                                <url>https://taxserver.sirena-travel.ru</url>
                                <path>/fh/documents/socketio</path>
                                <namespace />
                            </service>
                        </socketio>
                    </responseDeliveryGateway>
                </availableServices>
                <allowedOperations>
                    <encashment />
                    <refill />
                    <flowStatementsReport />
                    <issueDocuments>
                        <closeShift />
                        <cheque>
                            <credit />
                            <creditReturn />
                            <debit />
                            <debitReturn />
                        </cheque>
                        <currentSettlementReport />
                    </issueDocuments>
                </allowedOperations>
                <supportedExtensions>
                    <subjectsDepartments />
                    <printoutCopies>
                        <issueDocuments>
                            <cheque>
                                <credit />
                                <creditReturn />
                                <debit />
                                <debitReturn />
                            </cheque>
                        </issueDocuments>
                    </printoutCopies>
                </supportedExtensions>
            </single>
        </tns:deviceRouteStatusResponse>
    </soap:Body>
</soap:Envelope>`
