import { Button, DialogContent, DialogTitle } from "@mui/material";
import useOdvDetailedListCancel from "api/mutation/useOdvDetailedListCancel";
import useOdvDetailedListCancelDomain from "api/query/useOdvDetailedListCancelDomain";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import Form from "components/templates/Form/Form";
import { useMemo } from "react";

export default function CancelLineDialog({ row, onClose: handleClose }) {
  const { mutate: cancelRow, isLoading: isCanceling } = useOdvDetailedListCancel({
    onSuccess: () => handleClose(),
  });
  const { data, isSuccess } = useOdvDetailedListCancelDomain();
  const options = useMemo(
    () => (isSuccess ? data.map((e) => ({ value: e.cod, label: e.dexm })) : []),
    [data, isSuccess]
  );
  return (
    <>
      <DialogTitle>
        Annulla riga - {row.marchio} {row.linea} {row.codice}
      </DialogTitle>
      <DialogContent>
        <Form
          loading={isCanceling}
          bypassValidation={true}
          fields={[
            {
              xs: 12,
              id: "annull_causale",
              defaultValue: null,
              Component: AutocompleteFilter,
              componentProps: {
                inputProps: { variant: "standard" },
                options,
                fullWidth: true,
                placeholder: "Causale",
                size: "small",
              },
              required: true,
            },
          ]}
          send={(data) => {
            cancelRow({ in_id: row.id, in_caus_annullam: data.annull_causale.value, row });
          }}
          actions={[
            <Button color="error" variant="contained" onClick={handleClose}>
              Chiudi
            </Button>,
          ]}
        />
      </DialogContent>
    </>
  );
}
