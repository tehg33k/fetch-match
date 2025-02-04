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
import PetsIcon from "@mui/icons-material/Pets";
import { UserBar } from "./userBar";

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
        sortable: false,
        width: 200,
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
      <Box width={"100%"} height={{ xs: "100%", lg: "100vh" }}>
        <UserBar />
        <Grid container p={2} pb={0} spacing={2} flexDirection={"row"}>
          <Grid
            size={{ xs: 12, md: 3 }}
            container
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography
              variant="h2"
              mb={1}
              sx={{
                textShadow: "0 0 20px #00000059",
                fontSize: "2.75rem",
              }}
            >
              fetch<span style={{ fontWeight: "bold" }}>Match</span>
            </Typography>
            <PetsIcon
              sx={{
                color: "#0bc8e1",
                fontSize: 50,
                mb: 2,
                textShadow: "0 0 20px #00000059",
              }}
            />
          </Grid>
          <Grid container size={{ xs: 12, md: 9 }} alignItems={"center"}>
            <Grid size={{ xs: 12, md: 10 }}>
              <Typography
                ml={1}
                textAlign={"left"}
                maxWidth={{ xs: "100%", md: "600px" }}
              >
                Select your favorite dogs by clicking the the heart icon and
                then when you are ready, click the "Match" button to get matched
                with a dog.
              </Typography>
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 2 }}
              justifyContent={"flex-end"}
            >
              <Button
                variant="contained"
                disabled={favDogs.length === 0}
                onClick={() => handleDogMatch()}
                endIcon={<FavoriteBorder />}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Match
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container p={2} spacing={4}>
          <Grid
            container
            spacing={2}
            size={{ xs: 12, md: 3 }}
            alignContent={"start"}
            sx={{ backgroundColor: "#ffffff", p: 2 }}
            borderRadius={"8px"}
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
                fullWidth
                onClick={() => {
                  setSearchQuery("");
                  fetchDogs();
                }}
                variant="text"
              >
                Filter Dogs
              </Button>
            </Grid>
          </Grid>
          <Grid
            size={{ xs: 12, md: 9 }}
            maxHeight={{ xs: "100", md: "70vh" }}
            sx={{
              overflow: "auto",
              position: "relative",
            }}
            borderRadius={"8px"}
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
              hasMobileLayout
              mobileProps={{
                mobileCustomDefaultAccessor: (val: IDog) => {
                  return (
                    <DogImgMobile
                      className={classes.dogImgMobile}
                      src={val.img}
                      alt="dog"
                    />
                  );
                },
              }}
            />
          </Grid>
          <Grid container spacing={2} size={{ xs: 12, md: 3 }}></Grid>
          <Grid container spacing={2} size={{ xs: 12, md: 9 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                variant="contained"
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
                variant="contained"
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
          open={matchedDog.length > 0}
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
            <MatchedDogImg
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
  dogImgMobile: `${PREFIX}-dog-image`,
  matchedDogImg: `${PREFIX}-matched-dog-image`,
};

const StyledImg = styled("img")(() => ({
  [`&.${classes.dogImg}`]: {
    objectFit: "cover",
    width: "100%",
    borderRadius: "8px",
  },
}));

const MatchedDogImg = styled("img")(() => ({
  [`&.${classes.matchedDogImg}`]: {
    objectFit: "cover",
    width: "100%",
  },
}));

const DogImgMobile = styled("img")(() => ({
  [`&.${classes.dogImgMobile}`]: {
    objectFit: "cover",
    width: "200px",
    height: "150px",
    borderRadius: "8px",
  },
}));
