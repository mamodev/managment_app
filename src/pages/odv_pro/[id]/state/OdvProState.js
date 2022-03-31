import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useNavigate, useParams } from "react-router-dom";
import { odv_pro_state_summary } from "./columns";

export default function OdvProState() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cellClickHandler = ({ field, row: { gru_fatt_id } }) => {
    console.log("here");
    if (field === "gru_fatt_id" && gru_fatt_id)
      navigate(`/gruppo_fatturazione/${gru_fatt_id}`);
  };

  return (
    <>
      <ApiServer endpoint={endpoints.ODV_PRO_SUMMARY_LIST} params={{ id }}>
        <ApiDataList
          columns={odv_pro_state_summary}
          containerProps={{ spacing: 4 }}
          onCellClick={cellClickHandler}
        />
      </ApiServer>
    </>
  );
}
