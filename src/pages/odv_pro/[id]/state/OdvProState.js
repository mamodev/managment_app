import ApiServer from "components/layout/ApiServer";
import ApiDataList from "components/templates/ApiDataList";
import { useParams } from "react-router-dom";
import { odv_pro_state_summary } from "./columns";

export default function OdvProState() {
  const { id } = useParams();

  return (
    <>
      <ApiServer
        query={{
          table: "v_lista_righe_forma_riep",
          select:
            "seq,item,dex,um,qta,prz_tot_ivato,stato_acquisto,gru_fatt_nr,gru_cons_nr,stato_consegna,lista_id,lista_testate_id,gru_fatt_id,gru_cons_id",
          profile: "vend",
          lista_testate_id: `eq.${id}`,
        }}
      >
        <ApiDataList
          columns={odv_pro_state_summary}
          containerProps={{ spacing: 4 }}
        />
      </ApiServer>
    </>
  );
}
