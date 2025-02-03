import { Box, Button, styled, Typography, Checkbox } from "@mui/material";
import { getDogs, searchDogs } from "../fetch/dogs";
import { useEffect, useMemo, useState } from "react";
import { IDog } from "../models/dogs";
import { SimpleDataGrid } from "./simple-data-grid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { red } from "@mui/material/colors";

export const Match = () => {
  const [dogs, setDogs] = useState<IDog[]>([]);
  const [favDogs, setFavDogs] = useState<string[]>([]);

  const handleFavClick = (dogId: string) => {
    setFavDogs((prevFavDogs) => {
      if (prevFavDogs.includes(dogId)) {
        // If dog is already in the favorites list, remove it
        return prevFavDogs.filter((id) => id !== dogId);
      } else {
        // If dog is not in the favorites list, add it
        return [...prevFavDogs, dogId];
      }
    });
  };

  useEffect(() => {
    console.log("Favorite Dogs: ", favDogs);
  }, [favDogs]);

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
        width: 250,
        sortable: false,
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
      {
        field: "actions",
        headerName: "Favorite",
        type: "string",
        flex: 1,
        renderCell: (params: GridRenderCellParams<IDog>) => {
          const { row } = params;
          return (
            <>
              <Checkbox
                checked={favDogs.includes(row.id)}
                onChange={() => handleFavClick(row.id)}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                sx={{
                  color: red[800],
                  "&.Mui-checked": {
                    color: red[600],
                  },
                }}
              />
            </>
          );
        },
      },
    ];
  }, [dogs, favDogs]);

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
            disableRowSelectionOnClick
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
