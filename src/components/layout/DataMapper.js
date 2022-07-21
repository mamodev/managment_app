import React from "react";

export default function DataMapper({ map = (e) => e, field = "data", children, ...props }) {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, buildDataObject(props[field].map(map), field));
    }
    return child;
  });
}

function buildDataObject(data, field) {
  const dataObject = {};
  dataObject[field] = data;
  return { ...dataObject };
}
