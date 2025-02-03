import {
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
  GridSortModel,
  GridCallbackDetails,
} from "@mui/x-data-grid";

import { Box, Typography, useMediaQuery, styled } from "@mui/material";

export interface SimpleDataGridProps
  extends Omit<
    MuiDataGridProps,
    | "sortingMode"
    | "paginationMode"
    | "onPageChange"
    | "onSortModelChange"
    | "page"
    | "pageSize"
    | "onPageSizeChange"
  > {
  rowHeight?: number;
  onSortModelChange?: (
    model: GridSortModel,
    details: GridCallbackDetails<any>
  ) => void;
  mobileBreakPoint?: number;
  hasMobileLayout?: boolean;
  mobileProps?: {
    useFirstCell?: boolean;
    handleSelect?: (val: any) => void;
    handleView?: (val: any) => void;
    handleEdit?: (val: any) => void;
    handleDelete?: (val: any) => void;
    handleDownload?: (val: any) => void;
    handleAccordionLabel?: (val: any) => void;
    mobileDefaultAccessor?: string;
    type?: string;
    showHandleActions?: boolean;
    isSelectedIndex?: number | null;
    mobileCustomDefaultAccessor?: (val: any) => void;
    handleDeleteDisabled?: boolean;
    stackAccordionDetails?: boolean;
  };
  noResultsMessage?: string;
}

export const SimpleDataGrid = ({
  noResultsMessage,
  rowHeight,
  rowCount,
  ...props
}: SimpleDataGridProps) => {
  return (
    <GridWrapper key={rowCount}>
      <MuiDataGrid
        className={classes.dataGrid}
        hideFooter
        disableColumnSelector
        slots={{
          noRowsOverlay: () => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="body1" textAlign="center" margin={0}>
                {noResultsMessage ?? "There are no results to display."}
              </Typography>
            </Box>
          ),
        }}
        rowHeight={rowHeight ?? 35}
        {...props}
      />
    </GridWrapper>
  );
};

const PREFIX = "SimpleDataGrid";

const classes = {
  dataGrid: `${PREFIX}-dataGrid`,
};

const GridWrapper = styled("div")(({ theme }) => ({
  [`& .${classes.dataGrid}`]: {
    background: theme.palette.background.paper,
    border: "none",
    "& .MuiDataGrid-columnHeaders": {
      border: "none",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: "bold",
      color: theme.palette.text.primary,
    },
    "& .MuiDataGrid-columnSeparator": {
      opacity: "0 !important",
    },
    "& .MuiDataGrid-cell": {
      fontSize: theme.typography.body2.fontSize,
      fontWeight: "bold",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      color: theme.palette.text.primary,
    },
    "& .MuiTablePagination-selectLabel": {
      marginBottom: 0,
    },
    "& .MuiTablePagination-displayedRows": {
      marginBottom: 0,
    },
  },
}));
