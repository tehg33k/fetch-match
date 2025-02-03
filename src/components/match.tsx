import { Box, Button, styled, Typography } from "@mui/material";
import { getDogs, searchDogs } from "../fetch/dogs";
import { useMemo, useState } from "react";
import { IDog } from "../models/dogs";
import { SimpleDataGrid } from "./simple-data-grid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { width } from "@mui/system";

export const Match = () => {
  const [dogs, setDogs] = useState<IDog[]>([]);

  const fetchDogs = async () => {
    try {
      const searchRes = await searchDogs();

      const res = await getDogs(searchRes.resultIds);
      setDogs(res);
    } catch (error) {
      console.error(error);
    }
  };

  const dogColumns = useMemo((): GridColDef[] => {
    return [
      {
        field: "img",
        headerName: "",
        type: "string",
        renderCell: (params: GridRenderCellParams<IDog>) => {
          const { row } = params;
          return (
            <>
              <StyledImg
                height={"100%"}
                className={classes.dogImg}
                src={row.img}
              />
            </>
          );
        },
      },
      {
        field: "breed",
        headerName: "Breed",
        type: "string",
        flex: 1,
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 1,
      },
      {
        field: "age",
        headerName: "Age",
        type: "string",
        flex: 1,
      },
      {
        field: "zip_code",
        headerName: "Zip Code",
        type: "string",
        flex: 1,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogs]);

  return (
    <Box width={"100%"}>
      <Typography variant="h2" color="#000000">
        Match
      </Typography>
      <Button onClick={fetchDogs}>Fetch Dogs</Button>
      {dogs && dogs.length > 0 && (
        <Box p={2}>
          <SimpleDataGrid
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            getRowId={(row) => row.id}
            columns={dogColumns}
            rows={dogs ?? []}
            rowHeight={250}
          />
        </Box>
      )}
    </Box>
  );
};

const PREFIX = "FetchMatch";

const classes = {
  dogImg: `${PREFIX}-dog-image`,
};

const StyledImg = styled("img")(() => ({
  [`&.${classes.dogImg}`]: {
    objectFit: "cover",
    width: "100%",
  },
}));
