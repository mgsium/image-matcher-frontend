import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Painting from './Painting.tsx';
import { Container, Row } from "react-bootstrap";
import React from 'react';

const images = [
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1567.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP247630.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1944.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1943.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1911.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1939.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP320128.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP-20099-001.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP375450_cropped.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1492.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP-14936-049.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1926.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/77J_045R2M.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP130322.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1025.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1562.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1408.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP317780.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT49.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP-23550-001.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP-14936-047.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13139-001.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1977.jpg",
  "https://images.metmuseum.org/CRDImages/ep/web-large/DT1576.jpg",
];

function getRandomImages(n: number): string[] {
  let randomImages: string[] = [];
  let index = 0;

  for (let i = 0; i < n; i++) {
    index = Math.floor(Math.random() * images.length);
    randomImages.push(images[index]);
  }

  return randomImages;
}

function movingImage(url: string, isLeftMoving: boolean) {
  return <Painting url={url} isLeftMoving={isLeftMoving} />;
}

function leftMovingImage(url: string) {
  return movingImage(url, true);
}

function rightMovingImage(url: string) {
  return movingImage(url, false);
}

type Props = {};
type State = {
  imageRow: (offset: number) => any[],
  offset: number
};

export default class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      imageRow: (offset) => [
        getRandomImages(10).map(leftMovingImage),
        getRandomImages(10).map(rightMovingImage),
        getRandomImages(10).map(leftMovingImage)
      ],
      offset: 0
    }
  }

  render() {
    return (
      <>
        <Container style={{ overflow: "hidden" }} fluid>
          <div
            style={{
              position: "fixed",
              zIndex: 9999,
              bottom: 10,
              left: 10,
              background: "rgba(0, 0, 0, .8)",
              color: "white",
              padding: "7px 15px",
              borderRadius: ".35rem",
              fontSize: 18
            }}
          >
            Image Matcher
          </div>
          {
            [0, 1, 2].map(x => (
              <Row
                style={{
                  height: "calc(100vh/3)",
                  // flexDirection: (x % 2 !== 0 ? "row-reverse" : "row"),
                  flexWrap: "nowrap"
                }}
              >
                {this.state.imageRow(x)[x]}
              </Row>
            ))
          }

        </Container>
      </>
    );
  }
}
