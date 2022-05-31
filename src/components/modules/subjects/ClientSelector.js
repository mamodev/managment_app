import { endpoints } from "api";
import CreateSubject from "./CreateSubject";
import SubjectSelector from "./SubjectSelector";

export default function ClientSelector({ ...props }) {
  return (
    <SubjectSelector
      title="Seleziona un cliente"
      buttonText="Cliente"
      endpoint={endpoints.CLIENTS}
      actions={<CreateClient variant="contained" color="secondary" />}
      {...props}
    />
  );
}

export function CreateClient(props) {
  return <CreateSubject endpoint={endpoints.CLIENTS} title="Aggiungi cliente" {...props} />;
}
