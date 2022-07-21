import { Box, Stack } from "@mui/material";
import { endpoints } from "api";
import Title from "components/base/Title";
import ApiServer from "components/layout/ApiServer";
import AutocompleteFilter from "components/modules/filters/AutocompleteFilter";
import { useState } from "react";
import ProductsTable from "./ProductsTable";
import useDomains from "./useDomains";

export default function Articoli() {
  const [filters, setFilters] = useState({
    cod_iva: null,
    tipo_art_dex: null,
    categ_cont_dex: null,
    stato: null,
  });

  const { products, iva, cat } = useDomains();

  return (
    <Stack spacing={2} sx={{ height: "100%" }}>
      <Box p={2}>
        <Title mb={2}>LISTA ARTICOLI</Title>
        <Stack direction="row" spacing={2} sx={{ maxWidth: 800 }}>
          <AutocompleteFilter
            options={products ? products.map((e) => e.dex) : []}
            value={filters.tipo_art_dex}
            onChange={(val) => setFilters((old) => ({ ...old, tipo_art_dex: val }))}
            size="small"
            placeholder="Tipo"
            sx={{ flex: 1 }}
            inputProps={{ sx: { width: "100%" } }}
          />
          <AutocompleteFilter
            options={cat ? cat.map((e) => e.dexb) : []}
            value={filters.categ_cont_dex}
            onChange={(val) => setFilters((old) => ({ ...old, categ_cont_dex: val }))}
            size="small"
            placeholder="Cat. contabile"
            sx={{ flex: 1 }}
            inputProps={{ sx: { width: "100%" } }}
          />
          <AutocompleteFilter
            options={iva ? iva.map((e) => e.cod) : []}
            value={filters.cod_iva}
            onChange={(val) => setFilters((old) => ({ ...old, cod_iva: val }))}
            size="small"
            placeholder="Cod. IVA"
            sx={{ flex: 1 }}
            inputProps={{ sx: { width: "100%" } }}
          />
          <AutocompleteFilter
            options={["attivi", "sospesi", "obsoleti"]}
            value={filters.stato}
            onChange={(val) => setFilters((old) => ({ ...old, stato: val }))}
            size="small"
            placeholder="Stato"
            sx={{ flex: 1 }}
            inputProps={{ sx: { width: "100%" } }}
          />
        </Stack>
      </Box>
      <ApiServer endpoint={endpoints.PRODUCTS_DETAIL}>
        <ProductsTable filters={filters} />
      </ApiServer>
    </Stack>
  );
}
