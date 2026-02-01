import * as XLSX from "xlsx";

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheets = workbook.SheetNames;
        const result = {};

        for (const name of sheets) {
          const sheet = workbook.Sheets[name];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          const headers = json.length > 0 ? Object.keys(json[0]) : [];
          result[name] = { headers, rows: json };
        }

        resolve({ sheets, data: result, fileName: file.name });
      } catch (err) {
        reject(new Error("Failed to parse file: " + err.message));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}
