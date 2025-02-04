import { FC } from "react";
import clsx from "clsx";
// Components
import {
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Button,
  styled,
} from "@mui/material";
import {
  Delete,
  Download,
  Edit,
  ExpandMore,
  Visibility,
} from "@mui/icons-material";
import { resolveObjectField } from "../helpers";

interface IMobileTable {
  row: any;
  handleEdit?: (val: any) => void;
  handleDelete?: (val: any) => void;
  handleDeleteDisabled?: boolean;
  handleDownload?: (val: any) => void;
  handleAccordionLabel?: (val: any) => void;
  handleSelect?: (val: any) => void;
  handleView?: (val: any) => void;
  isSelectedIndex?: number | null;
  fields: {
    field: string;
    type?: string;
    headerName: string;
    renderCell?: (value: { row: Record<string, unknown> }) => JSX.Element;
  }[];
  mobileDefaultAccessor?: string;
  mobileCustomDefaultAccessor?: (val: any) => void;
  truncateAccordionLabel?: boolean;
  useFirstCell?: boolean;
  type?: string;
  showHandleActions?: boolean;
  stackAccordionDetails?: boolean;
}

export const MobileTable: FC<IMobileTable> = ({
  handleDownload,
  handleEdit,
  handleDelete,
  handleView,
  handleSelect,
  fields,
  row,
  mobileDefaultAccessor,
  mobileCustomDefaultAccessor,
  truncateAccordionLabel = false,
  useFirstCell,
  type,
  showHandleActions,
  isSelectedIndex,
  handleDeleteDisabled,
  stackAccordionDetails = false,
}) => {
  // for the verify addresses table, conditionaly show the edit button
  const showEdit =
    type === "verifyAddresses" && row?.whenVerified ? false : true;
  return (
    <StyledAccordion
      className={classes.root}
      data-testid="accordion-wrapper"
      slotProps={{ transition: { unmountOnExit: true } }}
      stackAccordionDetails={stackAccordionDetails}
    >
      <AccordionSummary
        className={classes.accordion}
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        data-testid="accordion-summary"
      >
        <div className={classes.topPanelSummaryWrapper}>
          <Typography
            color="primary"
            className={clsx(
              classes.boldName,
              truncateAccordionLabel && classes.accordionLabelNoWrapAndTruncate
            )}
          >
            {useFirstCell && fields?.[0]?.renderCell?.({ row })}
            {!useFirstCell &&
              mobileDefaultAccessor &&
              row[
                fields.find((field) => {
                  return field.field === mobileDefaultAccessor;
                })?.field ?? 0
              ]}
            {!useFirstCell &&
              mobileCustomDefaultAccessor &&
              mobileCustomDefaultAccessor(row)}
            {!useFirstCell &&
              !mobileDefaultAccessor &&
              !mobileCustomDefaultAccessor &&
              row[fields?.[0]?.field]}
          </Typography>
          <div className={classes.buttonsWrapper}>
            {showHandleActions && (
              <>
                {fields
                  ?.find?.((f) => f.field === "actions")
                  ?.renderCell?.({ row })}
              </>
            )}
            {handleView && (
              <IconButton
                className={classes.editButton}
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleView(row);
                }}
                data-testid="view-button"
              >
                <Visibility />
              </IconButton>
            )}
            {handleDownload && (
              <IconButton
                className={classes.editButton}
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDownload(row);
                }}
                data-testid="download-button"
              >
                <Download />
              </IconButton>
            )}
            {handleEdit && showEdit && (
              <IconButton
                className={classes.editButton}
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleEdit(row);
                }}
                data-testid="edit-button"
              >
                <Edit />
              </IconButton>
            )}
            {handleDelete && (
              <IconButton
                className={classes.deleteButton}
                color="default"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDelete(row);
                }}
                disabled={handleDeleteDisabled}
                data-testid="delete-button"
              >
                <Delete />
              </IconButton>
            )}
            {handleSelect && (
              <Button
                color="primary"
                size="small"
                disabled={isSelectedIndex === row.index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(row);
                }}
                data-testid="select-button"
              >
                Select
              </Button>
            )}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {fields
          .filter((f) => f.headerName)
          ?.map((field: (typeof fields)[0], index) => {
            return (
              <div key={`${index}`} className={classes.panelSummaryWrapper}>
                <FormLabel
                  component="span"
                  className={clsx(classes.boldName, classes.subLabel)}
                >
                  {field?.headerName?.length > 1
                    ? `${field.headerName}:`
                    : field.headerName}
                </FormLabel>
                <Typography component="span" className={classes.truncate}>
                  <>
                    {!!field?.type &&
                    field?.type === "boolean" &&
                    row[field.field] === true
                      ? "Yes"
                      : ""}
                    {typeof field.field === "string" &&
                    typeof field.renderCell !== "function"
                      ? !resolveObjectField(field?.field, row)
                        ? "--"
                        : resolveObjectField(field?.field, row)
                      : typeof field?.renderCell === "function"
                      ? ""
                      : "--"}
                    {typeof field?.renderCell === "function"
                      ? field?.renderCell({ row })
                      : null}
                  </>
                </Typography>
              </div>
            );
          })}
      </AccordionDetails>
    </StyledAccordion>
  );
};

const MOBILE_MEDIA_QUERY = "@media (max-width: 576px)";
const MOBILE_MEDIA_QUERY_XS = "@media (max-width: 400px)";

const PREFIX = "MobileTable";

const classes = {
  root: `${PREFIX}-root`,
  accordion: `${PREFIX}-accordion`,
  topPanelSummaryWrapper: `${PREFIX}-topPanelSummaryWrapper`,
  panelSummaryWrapper: `${PREFIX}-panelSummaryWrapper`,
  details: `${PREFIX}-details`,
  editButton: `${PREFIX}-editButton`,
  deleteButton: `${PREFIX}-deleteButton`,
  approvalButton: `${PREFIX}-approvalButton`,
  rejectButton: `${PREFIX}-rejectButton`,
  boldName: `${PREFIX}-boldName`,
  subLabel: `${PREFIX}-subLabel`,
  truncate: `${PREFIX}-truncate`,
  buttonsWrapper: `${PREFIX}-buttonsWrapper`,
  accordionLabelNoWrapAndTruncate: `${PREFIX}-accordionLabelNoWrapAndTruncate`,
};

const StyledAccordion = styled(Accordion, {
  shouldForwardProp: (prop) => prop !== "stackAccordionDetails",
})<{ stackAccordionDetails: boolean }>(({ theme, stackAccordionDetails }) => ({
  [`&.${classes.root}`]: {
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey[300]}`,
    overflowX: "hidden",
  },

  [`& .${classes.accordion}`]: {
    padding: "0 16px",
    "&& .MuiAccordionSummary-expandIcon": {
      padding: 3,
    },
  },

  [`& .${classes.topPanelSummaryWrapper}`]: {
    marginTop: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    "&:first-child": { marginTop: 0 },
  },

  [`& .${classes.panelSummaryWrapper}`]: {
    display: "flex",
    alignItems: stackAccordionDetails ? "flex-start" : "center",
    flexDirection: stackAccordionDetails ? "column" : "row",
    "&:first-child": { marginTop: 0 },
    marginBottom: stackAccordionDetails ? theme.spacing(1) : 0,
  },

  [`& .${classes.details}`]: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 16px",
    backgroundColor: theme.palette.grey[100],
  },

  [`& .${classes.editButton}`]: {
    padding: `2px 5px`,
  },

  [`& .${classes.deleteButton}`]: {
    padding: `2px 5px`,
    color: theme.palette.error.main,
  },

  [`& .${classes.approvalButton}`]: {
    padding: `2px`,
    marginRight: "6px",
    backgroundColor: theme.palette.success.main,
    color: "#ffffff",
    "&:hover": {
      backgroundColor: theme.palette.success.main,
      color: "#ffffff",
    },
    "& svg": {
      width: ".75em",
      height: ".75em",
    },
  },

  [`& .${classes.rejectButton}`]: {
    padding: `2px`,
    marginRight: "6px",
    backgroundColor: theme.palette.error.main,
    color: "#ffffff",
    "&:hover": { backgroundColor: theme.palette.error.main, color: "#ffffff" },
    "& svg": {
      width: ".75em",
      height: ".75em",
    },
  },

  [`& .${classes.boldName}`]: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },

  [`& .${classes.subLabel}`]: {
    marginRight: 10,
    whiteSpace: "nowrap",
  },

  [`& .${classes.truncate}`]: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "90%",
  },

  [`& .${classes.buttonsWrapper}`]: {
    display: "flex",
  },

  [`& .${classes.accordionLabelNoWrapAndTruncate}`]: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "90%",
    marginRight: -16,
    [MOBILE_MEDIA_QUERY]: {
      width: "60vw",
    },
    [MOBILE_MEDIA_QUERY_XS]: {
      width: "56vw",
    },
  },
}));
