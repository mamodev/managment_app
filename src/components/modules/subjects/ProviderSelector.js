import { endpoints } from "api";
import CreateSubject from "./CreateSubject";
import SubjectSelector from "./SubjectSelector";

export default function ProviderSelector({ ...props }) {
  return (
    <SubjectSelector
      title="Seleziona un fornitore"
      buttonText="Fornitore"
      endpoint={endpoints.PROVIDERS}
      actions={<CreateProvider variant="contained" color="secondary" />}
      {...props}
    />
  );
}

export function CreateProvider(props) {
  return <CreateSubject endpoint={endpoints.PROVIDERS} title="Aggiungi fornitore" {...props} />;
}
