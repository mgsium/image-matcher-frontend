import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


import Painting from './Painting.tsx';
import { Container, Row } from "react-bootstrap";
import React from 'react';
import { ReactComponent as LogoSvg } from "./logo.svg";
import { EventEmitter } from 'stream';

let interval;
let scrollInterval;

function distribute(imgs, buckets, pop: boolean) {
  let step: number = imgs.length / buckets.length;

  for (let i = 0; i < buckets.length; i++) {
    for (let j = i * step; j < (i + 1) * step; j++) {
      buckets[i].push(movingImage(imgs[j], i % 2 === 0));
      // if (pop) buckets[i].pop();
    }
  }

  return buckets;
}

function movingImage(painting: any, isLeftMoving: boolean) {
  return <Painting
    key={Math.random()}
    url={painting.url}
    url_large={painting.url_large}
    artist={painting.author}
    isLeftMoving={isLeftMoving}
    title={painting.title}
    created={painting.created}
    likes={painting.likes}
  />;
}

type Props = {};
type State = {
  imageRow: any[],
  page: number
};


export default class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      imageRow: [[], [], []],
      page: 0
    }

    scrollInterval = setInterval(() => {
      let elem = document.getElementById("toprow");
      if (elem) elem.scrollLeft += 20;
    }, 1000);
  }

  loadImages = async () => {
    await fetch(`http://20.0.0.86:3000/list/30/${this.state.page}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          imageRow: distribute(
            data,
            this.state.imageRow,
            false //this.state.page > 2
          ),
          page: this.state.page + 1
        }, () => {
          console.log(data);
        });
      });
  }

  componentDidMount = () => {
    this.loadImages();
    this.loadImages();
    interval = setInterval(this.loadImages, 10000);
  }

  componentWillUnmount = () => {
    clearInterval(interval);
    clearInterval(scrollInterval);
  }

  render() {
    return (
      <>
        <Container style={{ overflow: "hidden" }} fluid>
          <div
            style={{
              position: "fixed",
              zIndex: 9999,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              // background: "rgba(0, 0, 0, .75)",
              textAlign: "center",
              display: "table",
              animation: "fadeout 1.5s 1 ease-in forwards"
            }}
          >
            <div
              style={{
                display: "table-cell",
                verticalAlign: "middle"
              }}
            >
              <img
                src={require("./logo.png")}
                width={300}
              />
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              zIndex: 999,
              bottom: 10,
              left: 10
            }}
          >
            <span
              style={{
                background: "white",
                color: "rgba(0, 0, 0, .75)",
                padding: "5px 13px",
                borderRadius: ".35rem",
                fontSize: 26,
                display: "inline-block",
                fontFamily: "Crimson Text",
                fontWeight: "bold"
              }}
            >
              &nbsp;
              <LogoSvg style={{ width: 32, height: 32, marginBottom: 3 }} />
              &nbsp;
              Pictura
              &nbsp;
            </span>
          </div>
          {
            [0, 1, 2].map(x => (
              <Row
                style={{
                  height: "calc(100vh/3)",
                  flexDirection: (x % 2 !== 0 ? "row-reverse" : "row"),
                  flexWrap: "nowrap"
                }}
              >
                {this.state.imageRow[x]}
              </Row>
            ))
          }

        </Container>
      </>
    );
  }
}
