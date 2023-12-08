export const LoadError = () => {
  return (
    <div id="openShiftErrorDiv" className="hideOnStart">
      <h3>При открытии смены произошёл сбой</h3>
      <div>Технические данные:</div>
      <div>
        Код ошибки:
        <span className="printable" data-context="openShiftModel" data-key="issueError.code"></span>
      </div>
      <div>
        {' '}
        Описание ошибки:
        <span
          className="printable"
          data-context="openShiftModel"
          data-key="issueError.description"
        ></span>
      </div>
    </div>
  )
}
