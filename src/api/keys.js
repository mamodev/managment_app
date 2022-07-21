const KEYS = {
  ODV_DETAILED_LIST: (odv_id, row_type, struct_id) => [
    "ODV",
    odv_id,
    "DETAILS",
    "LIST",
    row_type,
    struct_id,
  ],
  ODV_DETAILED_LIST_PROJECT_STRUCTURE: (odv_id, project_id) => [
    "ODV",
    odv_id,
    "DETAILS",
    "PROJECT_STRUCTURE",
    project_id,
  ],
  ODV_DETAILED_LIST_CANCEL_DOMAIN: ["ODV_DETAILED_LIST_CANCEL_DOMAIN"],

  ODV_STATE: (odv_id) => ["ODV", odv_id, "STATE", "ROW"],
};

export { KEYS };
