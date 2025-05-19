import ExcelJS from "exceljs";

export const parseExcel = async (filePath: string, query: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];

  const headers: string[] = [];
  const rows: any[] = [];

  // Extract headers
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers.push(cell.text.trim());
  });

  worksheet.eachRow((row, index) => {
    if (index === 1) return; // skip header

    const rowData: Record<string, any> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      rowData[header] = cell.value;
    });

    rows.push(rowData);
  });

  // console.log("📄 Parsed Excel data:\n", rows);
  console.log(`📦 Total parsed rows: ${rows.length}`);

  const areaMatch = query.match(
    /(?:Analyze|analysis of|compare|price for)\s(.+)/i
  );
  const area = areaMatch?.[1]?.trim().toLowerCase();

  const filteredTable = rows.filter((d) =>
    Object.values(d).some((val) =>
      val
        ?.toString()
        .toLowerCase()
        .includes(area || "")
    )
  );

  const chartData = filteredTable.map((f) => ({
    year: f["year"],
    value: f["flat - weighted average rate"],
  }));

  return {
    data: rows,
    chartData,
    filteredTable,
  };
};
