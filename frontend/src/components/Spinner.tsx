import { Spinner as BSpinner } from "react-bootstrap";

const Spinner = () => (
  <BSpinner
    animation="border"
    role="status"
    style={{ width: "150px", height: "150px" }}
  >
    <span className="visually-hidden">Loading...</span>
  </BSpinner>
);

export default Spinner;
