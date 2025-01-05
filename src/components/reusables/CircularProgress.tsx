import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

const Styles = {
  Progress: styled(CircularProgress)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
    color: theme.vars.palette.primary.main,
  }))
}

function MyProgress({size=24}) {
  return (
    <>
      <Styles.Progress size={size} />
    </>
  );
}

export default MyProgress;
