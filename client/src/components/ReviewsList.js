import React, { useState } from "react";
import useFetch from "use-http";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import { Waypoint } from "react-waypoint";

const perPage = 20;

const ReviewsList = () => {
  const [count, setCount] = useState(0);
  const { data = [], loading } = useFetch(
    `/api/reviews?skip=${count}&limit=${perPage}`,
    {
      onNewData: (currReviews, newReviews) => {
        return currReviews ? [...currReviews, ...newReviews] : newReviews;
      },
      perPage,
    },
    [count]
  );

  return (
    <Container>
      <ListGroup>
        {data.map(({ title, _id, avg, size }) => (
          <ListGroupItem key={_id}>
            {title} -- {avg} stars -- {size} reviews
          </ListGroupItem>
        ))}
        <Waypoint
          onEnter={() => {
            setCount((c) => c + perPage);
          }}
        />
      </ListGroup>
    </Container>
  );
};

export default ReviewsList;
