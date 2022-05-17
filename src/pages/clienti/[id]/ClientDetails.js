import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataHeader from "components/templates/ApiDataHeader";
import { useAuthContext } from "context/AuthContext";
import { useParams } from "react-router-dom";
import client_detail_header from "./header";

//TODO add conditional rendering
//TODO note indirizzo multiline
export default function ClientDetails() {
  const { id } = useParams();
  const { api } = useAuthContext();
  return (
    <Box p={2}>
      <ApiServer endpoint={endpoints.CLIENT_DETAIL} params={{ id }}>
        <Title />
        <ApiDataHeader
          sx={{ border: 0 }}
          endpoint={endpoints.CLIENT_DETAIL(api, { id }).update}
          columns={client_detail_header}
          onChange={(data, mutate) => {
            const newData = {};
            for (let key in data) {
              newData[`in_${key}`] = data[key];
            }
            mutate(newData);
          }}
        />
      </ApiServer>
    </Box>
  );
}

function Title({ data }) {
  return <Typography variant="h5">Cliente {data[0]?.denom}</Typography>;
}
