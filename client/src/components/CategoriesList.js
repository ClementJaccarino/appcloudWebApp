import React from "react";
import useFetch from "use-http";
import { Container, Row, Col } from "reactstrap";

const CategoriesList = () => {
  const { loading, error, data = [] } = useFetch("/api/categories", {}, []);

  var dataCol = [];
  for (var i = 0; i < data.length; i++) {
    dataCol.push(<Col className="border">{data[i]}</Col>);
  }

  return (
    <Row xs="5" className="border mb-4">
      {dataCol}
    </Row>
  );
};

export default CategoriesList;
