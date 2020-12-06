import PodcastList from "./PodcastList";
import ReviewsList from "./ReviewsList";
import CategoriesList from "./CategoriesList";
import SearchBar from "./SearchBar";
import { Container, Row, Col, Input } from "reactstrap";

const UserPage = () => {
  return (
    <Container>
      {/* <Input placeholder="Search..." className="mb-4 w-25"></Input> */}
      <SearchBar></SearchBar>
      <h1>Categories List</h1>
      <CategoriesList></CategoriesList>
      <Row>
        <Col>
          <h1>Podcasts List</h1>
          <PodcastList></PodcastList>
        </Col>
        <Col>
          <h1>Best Podcast</h1>
          <ReviewsList></ReviewsList>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;
