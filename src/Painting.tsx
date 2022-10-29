import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

type Props = {
    isLeftMoving: boolean,
    url: string
};
type State = {
    selected: boolean
};

export default class Painting extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selected: false
        };
    }

    handleSelect = () => {
        this.setState({
            selected: !this.state.selected
        });
    }

    render() {

        return (
            <>
                <img
                    src={this.props.url}
                    style={{ height: "100%", width: "auto", padding: 0 }}
                    className={(this.props.isLeftMoving ? "moveHorizontalLeft" : "moveHorizontalRight") + " painting"}
                    alt="something cool"
                    onClick={this.handleSelect}
                />
                {
                    this.state.selected && (
                        <Container fluid
                            style={{
                                position: "fixed",
                                width: "100vw",
                                height: "100vh",
                                zIndex: 99,
                                top: 0, left: 0,
                                background: "rgba(0, 0, 0, .8)",
                                color: "rgba(255, 255, 255, .6)",
                                textAlign: "center",
                                paddingTop: "7.5vh"
                            }}

                            onClick={() => this.setState({ selected: false })}
                        >
                            <Row>
                                <h1 style={{ fontFamily: "Crimson Text", marginTop: 20, padding: "25px 0px" }}>
                                    <span style={{ fontStyle: "italic", fontWeight: "bold", color: "rgba(255, 255, 255, .85)" }}>Some Painting</span> &nbsp;by Vincent van Gogh, 1982
                                </h1>
                            </Row>
                            <Row style={{ padding: 10 }}>
                                <Col>
                                    <img
                                        src={this.props.url}
                                        style={{
                                            height: "50vh",
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
                                            background: "rgba(255, 255, 255, .75)",
                                            border: 0,
                                            color: "black",
                                            fontWeight: "bold",
                                            marginTop: 20,
                                            marginBottom: 10
                                        }}
                                    >
                                        See More Like This
                                    </Button>
                                </Col>
                            </Row>
                            <br />
                            <br />
                            <Row>
                                <Col>
                                    Test
                                </Col>
                            </Row>
                        </Container>
                    )
                }
            </>
        )
    }

}