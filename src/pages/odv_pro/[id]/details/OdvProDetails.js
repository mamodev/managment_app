import { odv_pro_id_details } from "./columns";
import ProductsDataGrid from "./ProductsDataGrid";

export default function OdvProDetails() {
  return <ProductsDataGrid rowType={'in.("V","P")'} columns={odv_pro_id_details} />;
}
