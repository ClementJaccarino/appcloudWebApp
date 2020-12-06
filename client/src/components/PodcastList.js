import React, { useState } from "react";
import useFetch from "use-http";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import { Waypoint } from "react-waypoint";

const perPage = 20;
const PodcastList = () => {
  const [count, setCount] = useState(0);
  const { data = [], loading } = useFetch(
    `/api/podcasts?skip=${count}&limit=${perPage}`,
    {
      onNewData: (currPodcasts, newPodcasts) => {
        return currPodcasts ? [...currPodcasts, ...newPodcasts] : newPodcasts;
      },
      perPage,
    },
    [count]
  );

  return (
    <Container>
      <ListGroup>
        {data.map(({ title, _id }) => (
          <ListGroupItem key={_id}>{title}</ListGroupItem>
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

export default PodcastList;
