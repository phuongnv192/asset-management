import * as XLSX from "xlsx";

/**
 * Method export data to XLSX file
 *
 * @param {*} data the data of export file
 * @param {string} fileName file name
 * @param {*[][]} heading custom heading of column
 */
const exportToXLSX = (fileName, heading, data) => {
	const extension = ".xlsx";

	//Had to create a new workbook and then add the header
	const wb = XLSX.utils.book_new();

	// Create new worksheet
	const ws = XLSX.utils.json_to_sheet([]);
	XLSX.utils.sheet_add_aoa(ws, [heading]);

	//Starting in the second row to avoid overriding and skipping headers
	XLSX.utils.sheet_add_json(ws, data, {origin: 'A2', skipHeader: true});

	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

	// Export file
	XLSX.writeFile(wb, fileName + extension);
};

export default exportToXLSX;