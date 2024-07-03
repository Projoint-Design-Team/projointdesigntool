import React, { FC } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import styles from "./documents-table.module.css";
import { FileAddIcon, FileIcon } from "../ui/icons";
import { useRouter } from "next/router";

import { useAttributes } from "@/context/attributes_context";
import { columns } from "./__columns/documents-table__columns";
import { Button } from "../ui/button";
import { DocumentData, fetchDocuments } from "./documents-table.constants";

import { addSurvey } from "../utils/add-survey";
import { DocumentsImport } from "../import/import";

export interface DocumentsTableProps {}

export const DocumentsTable: FC<DocumentsTableProps> = ({}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { storageChanged, setStorageChanged } = useAttributes();

  const [documents, setDocuments] = React.useState<DocumentData[]>([]);

  React.useEffect(() => {
    setDocuments(fetchDocuments());
  }, [storageChanged]);

  const router = useRouter();

  const handleAddSurvey = () => {
    addSurvey({ router: router, onStorageChange: setStorageChanged });
  };

  return (
    <section className={styles.table}>
      <div className={styles.tableContainer}>
        <div className={styles.top}>
          <div className={styles.docName}>
            <h2>Surveys</h2>
          </div>
          <div className={styles.docActions}>
            <DocumentsImport size="small" />
            <Button
              text="New survey"
              icon={<FileAddIcon stroke="var(--white)" />}
              onClick={handleAddSurvey}
            />
          </div>
        </div>
        <Paper
          sx={{
            width: "100%",
            boxShadow: "none",
            border: "1px solid var(--border-gray)",
          }}
        >
          <TableContainer sx={{ maxHeight: 900 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        top: 0,
                        minWidth: column.minWidth,
                        color: "var(--dark-blue-h)",
                      }}
                    >
                      <p>{column.label}</p>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {documents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <Link
                        href={`/${encodeURIComponent(row.id)}`}
                        key={row.id}
                      >
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.date}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.id === "name" ? (
                                  <div className={styles.file}>
                                    <FileIcon stroke="var(--dark-blue-p)" />
                                    <p className={styles.table_docName}>
                                      {value}
                                    </p>
                                  </div>
                                ) : column.format &&
                                  typeof value === "number" ? (
                                  <p className={styles.table_docValue}>
                                    {column.format(value)}
                                  </p>
                                ) : (
                                  <p className={styles.table_docValue}>
                                    {value}
                                  </p>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </Link>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={documents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </section>
  );
};
