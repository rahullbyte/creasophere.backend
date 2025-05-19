import { Request, Response } from 'express';
import { parseExcel } from '../utils/excelParser.js';
import { getLLMSummary } from '../utils/generateSummary.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleAnalysis = async (req: Request, res: Response) => {
  const query = req.body.query;

  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const filePath = path.join(__dirname, '../data/Sample_data.xlsx');
    const { data, chartData, filteredTable } = await parseExcel(filePath, query);

    const summary = await getLLMSummary(query, data);

    return res.json({
      summary,
      chartData,
      table: filteredTable,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to analyze Excel file' });
  }
};
