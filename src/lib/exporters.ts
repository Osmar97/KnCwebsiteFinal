import * as XLSX from "xlsx";

export type ExportRow = Record<string, string | number | null | undefined>;

const sanitize = (name: string) =>
  name.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "") || "export";

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const toCsvValue = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const exportToCsv = (rows: ExportRow[], baseName: string) => {
  if (!rows.length) {
    triggerDownload(new Blob([""], { type: "text/csv;charset=utf-8" }), `${sanitize(baseName)}.csv`);
    return;
  }
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, r) => {
      Object.keys(r).forEach((k) => acc.add(k));
      return acc;
    }, new Set()),
  );
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => toCsvValue(r[h])).join(","));
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `${sanitize(baseName)}.csv`);
};

export const exportToXlsx = (rows: ExportRow[], baseName: string, sheetName = "Sheet1") => {
  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{}]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31) || "Sheet1");
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  triggerDownload(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${sanitize(baseName)}.xlsx`);
};