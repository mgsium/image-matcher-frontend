import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


import Painting from './Painting.tsx';
import { Button, Col, Container, Row } from "react-bootstrap";
import React from 'react';
import { ReactComponent as LogoSvg } from "./logo.svg";
import { PaintingT } from './Painting';

let interval;
let scrollInterval;

type Props = {};
type State = {
  imageRow: any[],
  page: number,
  selected?: PaintingT
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
    await fetch(`http://20.0.0.86:3000/group/true/30/${this.state.page}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          imageRow: this.distribute(
            data,
            this.state.imageRow,
            false //this.state.page > 2
          ),
          page: this.state.page + 1
        });
      });
  }

  distribute = (imgs, buckets, pop: boolean) => {
    let step: number = imgs.length / buckets.length;

    for (let i = 0; i < buckets.length; i++) {
      for (let j = i * step; j < (i + 1) * step; j++) {
        buckets[i].push(this.movingImage(imgs[j], i % 2 === 0));
        // if (pop) buckets[i].pop();
      }
    }

    return buckets;
  }

  movingImage = (painting: PaintingT, isLeftMoving: boolean) => {
    return <Painting
      key={Math.random()}
      painting={painting}
      isLeftMoving={isLeftMoving}
      showOverlay={this.selectPainting}
    />;
  }

  selectPainting = (painting: PaintingT) => {
    this.setState({
      selected: painting
    });
  }

  componentDidMount = () => {
    this.loadImages();
    this.loadImages();
    interval = setInterval(this.loadImages, 3000);
  }

  componentWillUnmount = () => {
    clearInterval(interval);
    clearInterval(scrollInterval);
  }

  incrementLikesOnSelected = async () => {
    if (!this.state.selected) return;

    const likedPaintings = JSON.parse(localStorage.getItem("likedPaintings") || "[]");
    if (likedPaintings.includes(this.state.selected.id)) return;

    likedPaintings.push(this.state.selected.id);
    const selected = this.state.selected;
    selected.likes = selected.likes ? selected.likes + 1 : 1;
    this.setState({
      selected: selected
    });
    localStorage.setItem("likedPaintings", JSON.stringify(likedPaintings));
    /*await fetch(`http://20.0.0.86:3000/like/${selected.id}`, {
      method: "POST"
    });*/
  }

  seeMoreLikeThis = async () => {
    if (!this.state.selected) return;

    clearInterval(interval);
    await fetch(`http://20.0.0.86:3000/similar/${this.state.selected.id}/30/0`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          imageRow: this.distribute(
            data,
            [[], [], []],
            false //this.state.page > 2
          ),
          page: 0,
          selected: undefined
        });
      });
    this.loadImages();
    interval = setInterval(this.loadImages, 3000);
  }

  render() {
    return (
      <>
        <Container style={{ overflow: "hidden" }} fluid>
          {
            this.state.selected && (
              <Container fluid
                style={{
                  position: "absolute",
                  width: "100vw",
                  height: "100vh",
                  zIndex: 9999,
                  top: 0, left: 0,
                  background: "rgba(0, 0, 0, .8)",
                  color: "rgba(255, 255, 255, .6)",
                  textAlign: "center",
                  paddingTop: "5vh"
                }}

                onClick={() => {
                  console.log("Overlay!");
                  // this.props.showOverlay();
                  // this.setState({ selected: false });
                }}
              >
                <Row>
                  <h1 style={{ fontFamily: "Crimson Text", marginTop: 20, padding: "25px 0px" }}>
                    <span style={{ fontStyle: "italic", fontWeight: "bold", color: "rgba(255, 255, 255, .85)" }}>{this.state.selected.title}</span> &nbsp;by {this.state.selected.author}{this.state.selected.created && ", " + this.state.selected.created}
                  </h1>
                </Row>
                <Row style={{ padding: 10 }}>
                  <Col>
                    <img
                      src={this.state.selected.url_large}
                      style={{
                        maxHeight: "60vh",
                        width: "auto",
                        padding: 0
                      }}
                      alt="something cool"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      style={{
                        background: "rgba(255, 255, 255, 1)",
                        border: 0,
                        color: "black",
                        fontWeight: "bold",
                        marginTop: 20,
                        marginBottom: 10
                      }}
                      onClick={this.seeMoreLikeThis}
                    >
                      See More Like This
                    </Button>
                    <Button
                      hidden
                      style={{
                        background: "rgba(220, 53, 69, 1)",
                        border: 0,
                        color: "white",
                        fontWeight: "bold",
                        marginTop: 20,
                        marginBottom: 10
                      }}
                      onClick={this.incrementLikesOnSelected}
                    >
                      {this.state.selected.likes || 0} Like{!(this.state.selected.likes && this.state.selected.likes === 1) && "s"}
                    </Button>
                  </Col>
                </Row>
                <br />
              </Container>
            )
          }
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
                className={x % 2 === 0 ? "moveHorizontalLeft" : "moveHorizontalRight"}
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
