// utils.js
const xlsx = require('xlsx');

function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  return data;
}

function generateSQL(data, customQuery) {
  if (!Array.isArray(data) || data.length < 2) {
    console.error("Data is not an array or does not contain enough rows:", data);
    return "Error: Data is not an array or does not contain enough rows.";
  }

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map((row, index) => {
    let query = customQuery;
    headers.forEach((header, i) => {
      query = query.replace(new RegExp(`{${header}}`, 'g'), `'${row[i]}'`);
    });
    query = query.replace(new RegExp(`{rowIndex}`, 'g'), index);
    return query;
  }).join('\n');
}

module.exports = {
  readExcel,
  generateSQL,
};
