// utils/dbLogger.js
export const logDatabaseError = (error, operation) => {
  console.error(`Erreur de base de données lors de l'opération "${operation}":`, {
    message: error.message,
    code: error.code,
    detail: error.detail,
    hint: error.hint,
    position: error.position,
    internalQuery: error.internalQuery,
  });
};

export const logDatabaseSuccess = (operation, result) => {
  console.log(`Opération "${operation}" réussie`, {
    rowCount: result?.rowCount,
    command: result?.command
  });
};