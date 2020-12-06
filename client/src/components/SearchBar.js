import { Form, FormGroup, Input } from "reactstrap";

const SearchBar = ({ keyword, setKeyword }) => {
  return (
    <Input
      className="mb-4 w-25"
      placeholder="Search..."
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
};

export default SearchBar;
