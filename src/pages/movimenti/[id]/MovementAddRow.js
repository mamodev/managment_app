import { Add } from "@mui/icons-material";
import { endpoints } from "api";
import ApiSelector from "components/modules/ApiSelect";
import ObjectTable from "components/templates/ObjectTable";
import {
  Button,
  Dialog,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  DialogContent,
  Stack,
  Typography,
  TextField,
  DialogActions,
} from "@mui/material";
import { useState } from "react";

const steps = ["Seleziona un magazzino", "Seleziona un articolo", "Imposta quantita'"];

export default function MovementAddRow({ onCreate: create, sede }) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button startIcon={<Add />} onClick={() => setOpen(true)}>
        Aggiungi
      </Button>

      {open && (
        <Dialog fullWidth open={open} onClose={handleClose}>
          <AddMovementStepper onClose={handleClose} onCreate={create} sede={sede} />
        </Dialog>
      )}
    </>
  );
}

function AddMovementStepper({ onClose: close, onCreate: create, sede }) {
  const isStepSkipped = () => false;
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState({ magazzino: null, articolo: null, qta: 0, colli: 0 });

  return (
    <>
      <DialogTitle>
        <Stepper activeStep={activeStep} sx={{ my: 2 }}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {data.magazzino && (
            <Stack>
              <Typography variant="subtitle1">Magazzino</Typography>
              <ObjectTable
                object={{
                  Sede: data.magazzino.sede,
                  Codice: data.magazzino.cod,
                  Descrizione: data.magazzino.dexm,
                }}
              />
            </Stack>
          )}
          {data.articolo && (
            <Stack>
              <Typography variant="subtitle1">Articolo</Typography>
              <ObjectTable
                object={{
                  Marchio: data.articolo.marchio,
                  Linea: data.articolo.linea,
                  Categoria: data.articolo.cat_dex,
                  Descrizione: data.articolo.art_dex,
                }}
              />
            </Stack>
          )}
          {activeStep === 0 && (
            <ApiSelector
              placeholder="Cerca magazzino..."
              endpoint={endpoints.WAREHOUSES}
              title={null}
              onSelect={(data) =>
                setData((old) => ({ ...old, magazzino: data })) || setActiveStep((old) => old + 1)
              }
              fields={[
                { field: "sede", headerName: "Sede" },
                { field: "cod", headerName: "Codice" },
                { field: "dexm", headerName: "Descrizione" },
              ]}
              filters={{ sede: `eq.${sede}` }}
              searchParams={["dexm", "cod"]}
            />
          )}

          {activeStep === 1 && (
            <ApiSelector
              placeholder="Cerca articolo..."
              endpoint={endpoints.PRODUCTS}
              title={null}
              onSelect={(data) =>
                setData((old) => ({ ...old, articolo: data })) || setActiveStep((old) => old + 1)
              }
              fields={[
                { field: "marchio", headerName: "Marchio" },
                { field: "linea", headerName: "Liena" },
                { field: "codice", headerName: "Codice" },
                { field: "cat_dex", headerName: "Categoria" },
                { field: "art_dex", headerName: "Descrizione" },
              ]}
              searchParams={["marchio", "linea", "cat_dex", "art_dex"]}
            />
          )}

          {activeStep === 2 && (
            <Stack spacing={2} sx={{ pt: 2 }}>
              <TextField
                value={data.qta}
                label="Quantità"
                type="number"
                onChange={(e) => setData((old) => ({ ...old, qta: e.target.value }))}
              />
              <TextField
                value={data.colli}
                label="Colli"
                type="number"
                onChange={(e) => setData((old) => ({ ...old, colli: e.target.value }))}
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={close}>
          Chiudi
        </Button>
        {activeStep > 0 && (
          <Button onClick={() => setActiveStep((old) => old - 1)}>Indietro</Button>
        )}
        {activeStep === 2 && (
          <Button
            disabled={!(data.qta && data.colli && data.qta > 0 && data.colli > 0)}
            variant="contained"
            onClick={() => {
              create(data);
              close();
            }}
          >
            Crea
          </Button>
        )}
      </DialogActions>
    </>
  );
}
