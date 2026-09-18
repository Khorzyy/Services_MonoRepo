import React, { useState, useMemo } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

  .thin-scroll::-webkit-scrollbar { width: 4px; }
  .thin-scroll::-webkit-scrollbar-track { background: transparent; }
  .thin-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 9999px; }
  .thin-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
`;

export default function DataTable({ columns, data, rowsPerPage = 5 }) {
  const [currentPage, setCurrentPage] = useState(1);

  // 🔴 Support "all" mode: jika rowsPerPage = -1 atau "all", tampilkan semua tanpa pagination
  const showAll = rowsPerPage === -1 || rowsPerPage === "all";

  const totalPages = showAll ? 1 : Math.ceil(data.length / rowsPerPage);

  // 🔴 Memoized currentData agar tidak re-calculate tiap render
  const currentData = useMemo(() => {
    if (showAll) return data;
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage, rowsPerPage, showAll]);

  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goToPrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const goToNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  // Generate page numbers (max 5 visible)
  const getPageNumbers = () => {
    if (showAll) return [];
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Reset ke halaman 1 jika data berubah
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (data.length === 0) {
    return (
      <>
        <style>{css}</style>
        <div className="jakarta flex items-center justify-center py-12 text-center">
          <div>
            <p className="text-sm text-neutral-400">Belum ada data</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="jakarta">
        {/* Table */}
        <div className="thin-scroll overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 w-16">
                  No
                </th>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentData.map((row, rowIndex) => (
                <tr
                  key={row.id_parkir || rowIndex} // 🔴 Gunakan unique key jika ada
                  className="border-b border-neutral-50 transition hover:bg-neutral-50/50"
                >
                  {/* Nomor Urut */}
                  <td className="px-4 py-3 text-sm font-medium text-neutral-500">
                    {showAll
                      ? rowIndex + 1
                      : (currentPage - 1) * rowsPerPage + rowIndex + 1}
                  </td>

                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-sm text-neutral-700"
                    >
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - HIDE if showAll */}
        {!showAll && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
            <p className="text-xs text-neutral-400">
              Menampilkan {(currentPage - 1) * rowsPerPage + 1} -{" "}
              {Math.min(currentPage * rowsPerPage, data.length)} dari{" "}
              {data.length} data
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={goToFirst}
                disabled={currentPage === 1}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Pertama"
              >
                {"<<"}
              </button>

              <button
                onClick={goToPrev}
                disabled={currentPage === 1}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Sebelumnya"
              >
                {"<"}
              </button>

              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    currentPage === number
                      ? "bg-brand-600 text-white"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Selanjutnya"
              >
                {">"}
              </button>

              <button
                onClick={goToLast}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Terakhir"
              >
                {">>"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
