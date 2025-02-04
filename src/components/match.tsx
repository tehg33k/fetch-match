import {
  Box,
  Button,
  styled,
  Typography,
  Checkbox,
  Grid2 as Grid,
  Autocomplete,
  TextField,
  Link,
  Dialog,
  IconButton,
  CircularProgress,
  DialogTitle,
} from "@mui/material";
import { createMatch, getDogBreeds, getDogs, searchDogs } from "../fetch/dogs";
import { useMemo, useState } from "react";
import { IDog } from "../models/dogs";
import { SimpleDataGrid } from "./simple-data-grid";
import {
  GridColDef,
  GridRenderCellParams,
  GridSortDirection,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  ChevronLeft,
  ChevronRight,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { useQuery } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";

export const Match = () => {
  const [favDogs, setFavDogs] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [imageModalTarget, setImageModalTarget] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string | undefined>("");
  const [sortDirection, setSortDirection] = useState<
    GridSortDirection | string
  >("");

  const [matchedDog, setMatchedDog] = useState<IDog[] | null>([]);

  const [prevSearchQuery, setPrevSearchQuery] = useState<string>("");
  const [nextSearchQuery, setNextSearchQuery] = useState<string>("");

  const onSortModelChange = (sortModel: GridSortModel) => {
    if (!sortModel.length) {
      setSortColumn("");
      setSortDirection("asc");
      return;
    }
    setSearchQuery("");
    setSortColumn(sortModel?.[0]?.field ?? "");
    setSortDirection(sortModel?.[0].sort);
  };

  const handleFavClick = (dogId: string) => {
    setFavDogs((prevFavDogs) => {
      if (prevFavDogs.includes(dogId)) {
        return prevFavDogs.filter((id) => id !== dogId);
      } else {
        return [...prevFavDogs, dogId];
      }
    });
  };

  const {
    data: dogs,
    refetch: fetchDogs,
    isFetching: isLoadingDogs,
  } = useQuery({
    queryKey: ["getDogs", sortDirection, sortColumn, searchQuery],
    queryFn: async () => {
      const searchRes = await searchDogs(
        searchQuery || "/dogs/search",
        searchQuery
          ? undefined
          : {
              breeds: searchQuery
                ? new URLSearchParams(searchQuery).getAll("breeds")
                : selectedBreeds,
              from: searchQuery
                ? new URLSearchParams(searchQuery).get("from") || undefined
                : "0",
              sort:
                sortColumn && sortDirection
                  ? `${sortColumn}:${sortDirection}`
                  : searchQuery
                  ? `${new URLSearchParams(searchQuery).get("sort")}`
                  : "breed:asc",
            }
      );
      if (searchRes.prev) setPrevSearchQuery(searchRes.prev);
      if (searchRes.next) setNextSearchQuery(searchRes.next);

      const res = await getDogs(searchRes.resultIds);
      return res;
    },
  });

  const { data: dogBreeds } = useQuery({
    queryKey: ["getDogBreeds"],
    queryFn: () => getDogBreeds(),
  });

  const handleDogMatch = async () => {
    try {
      const matchedResId = await createMatch(favDogs);
      const res = await getDogs([matchedResId.match]);

      setMatchedDog(res);
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
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<IDog>) => {
          const { row } = params;
          return (
            <>
              <Link
                onClick={() => {
                  setImageModalTarget(row.img);
                  setImageModalOpen(true);
                }}
                sx={{
                  cursor: "pointer",
                }}
              >
                <StyledImg
                  height={"100%"}
                  className={classes.dogImg}
                  src={row.img}
                />
              </Link>
            </>
          );
        },
      },
      {
        field: "breed",
        headerName: "Breed",
        type: "string",
        flex: 2,
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "age",
        headerName: "Age",
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "zip_code",
        headerName: "Zip Code",
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Favorite",
        type: "string",
        flex: 1,
        sortable: false,
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
    <>
      <Box width={"100%"}>
        <Grid container p={2} spacing={2} justifyContent={"center"}>
          <Grid size={{ xs: 12 }} maxWidth={"600px"}>
            <Typography variant="h2" color="#000000">
              Match
            </Typography>
            <Typography color="#000000">
              Favorite dogs by clicking the the heart icon and then when you are
              ready, click the "Match" button to get matched with a dog.
            </Typography>
            <Button
              variant="contained"
              disabled={favDogs.length === 0}
              onClick={() => handleDogMatch()}
            >
              Match
            </Button>
          </Grid>
        </Grid>
        <Grid container p={2} spacing={4}>
          <Grid
            container
            spacing={2}
            size={{ xs: 12, md: 3 }}
            alignContent={"start"}
          >
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={dogBreeds ?? []}
                onChange={(_, newValue: any) => {
                  if (newValue && newValue.length > 0) {
                    setSearchQuery("");
                    setPrevSearchQuery("");
                    setNextSearchQuery("");
                    setSelectedBreeds(newValue);
                  } else {
                    setSelectedBreeds([]);
                  }
                }}
                multiple
                renderInput={(params) => (
                  <TextField {...params} label="Breed" variant="outlined" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchQuery("");
                  fetchDogs();
                }}
              >
                Filter Dogs
              </Button>
            </Grid>
          </Grid>
          <Grid
            size={{ xs: 12, md: 9 }}
            maxHeight={"60vh"}
            sx={{
              overflow: "auto",
              position: "relative",
            }}
          >
            {isLoadingDogs && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 10,
                  inset: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <SimpleDataGrid
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              columns={dogColumns}
              rows={dogs ?? []}
              rowHeight={150}
              onSortModelChange={(model) => onSortModelChange(model)}
            />
          </Grid>
          <Grid container spacing={2} size={{ xs: 12, md: 3 }}></Grid>
          <Grid container spacing={2} size={{ xs: 12, md: 9 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                variant="outlined"
                fullWidth
                disabled={!prevSearchQuery}
                onClick={() => {
                  setSearchQuery(prevSearchQuery);
                }}
                startIcon={<ChevronLeft />}
              >
                Previous
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                variant="outlined"
                fullWidth
                disabled={!nextSearchQuery}
                onClick={() => {
                  setSearchQuery(nextSearchQuery);
                }}
                endIcon={<ChevronRight />}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {imageModalOpen && (
        <Dialog
          open={imageModalOpen}
          onClose={() => {
            setImageModalTarget("");
            setImageModalOpen(false);
          }}
          maxWidth={"lg"}
        >
          <IconButton
            aria-label="close"
            onClick={() => {
              setImageModalTarget("");
              setImageModalOpen(false);
            }}
            size="small"
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.common.white,
              border: "2px solid",
            })}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ ...styled, maxWidth: 500, width: "100%" }}>
            <img src={imageModalTarget} alt="dog" />
          </Box>
        </Dialog>
      )}
      {matchedDog && (
        <Dialog
          open={!!matchedDog}
          onClose={() => {
            setFavDogs([]);
            setMatchedDog(null);
          }}
          maxWidth={"lg"}
        >
          <DialogTitle sx={{ paddingRight: 8 }}>
            You've been matched with {matchedDog[0]?.name}!
            <Typography variant="body1">
              Age: {matchedDog[0]?.age}, Breed: {matchedDog[0]?.breed}, ZipCode:{" "}
              {matchedDog[0]?.zip_code}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => {
                setMatchedDog(null);
                setFavDogs([]);
              }}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.common.black,
              })}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Box
            display={"flex"}
            justifyContent={"center"}
            sx={{ ...styled, maxWidth: 500, width: "100%" }}
          >
            <StyledImg
              className={classes.matchedDogImg}
              src={matchedDog[0]?.img}
              alt="dog"
            />
          </Box>
        </Dialog>
      )}
    </>
  );
};

const PREFIX = "FetchMatch";

const classes = {
  dogImg: `${PREFIX}-dog-image`,
  matchedDogImg: `${PREFIX}-matched-dog-image`,
};

const StyledImg = styled("img")(() => ({
  [`&.${classes.dogImg}`]: {
    objectFit: "cover",
    width: "100%",
    borderRadius: "8px",
  },
  [`&.${classes.matchedDogImg}`]: {
    objectFit: "cover",
    width: "100%",
  },
}));
