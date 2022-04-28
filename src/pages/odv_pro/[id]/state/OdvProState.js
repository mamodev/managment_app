import { endpoints } from "api";
import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useWindowManagerContext } from "context/WindowManagerContext";
import { useParams } from "react-router-dom";
import { odv_pro_state_summary } from "./columns";

export default function OdvProState() {
  const { id } = useParams();

  const { newWindow } = useWindowManagerContext();
  const cellClickHandler = ({ field, row: { gru_fatt_id, gru_cons_id } }) => {
    if (field === "gru_cons_id" && gru_cons_id)
      newWindow({
        url: `/gruppo_consegna/${gru_cons_id}`,
        name: "Gruppo consegna",
        params: gru_cons_id,
      });
    if (field === "gru_fatt_id" && gru_fatt_id)
      newWindow({
        url: `/gruppo_fatturazione/${gru_fatt_id}`,
        name: "Gruppo fatturazione",
        params: gru_fatt_id,
      });
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
