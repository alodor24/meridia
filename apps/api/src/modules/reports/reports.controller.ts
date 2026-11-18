import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { buildTransactionsCsv } from "./reports.csv";
import { buildTransactionsPdf } from "./reports.pdf";
import { reportFileName, buildTransactionsReport } from "./reports.service";
import type { ReportQuery } from "./reports.schemas";

export const transactions = asyncHandler(
  async (req: Request, res: Response) => {
    const query = res.locals.validatedQuery as ReportQuery;
    const report = await buildTransactionsReport(req.user!, query);
    const fileName = reportFileName(report);

    res.setHeader("Cache-Control", "no-store");

    if (query.format === "pdf") {
      const pdf = await buildTransactionsPdf(report);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fileName}.pdf"`,
      );
      res.send(pdf);
      return;
    }

    const csv = buildTransactionsCsv(report);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.csv"`,
    );
    res.send(csv);
  },
);
