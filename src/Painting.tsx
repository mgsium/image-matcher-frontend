import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

export type PaintingT = {
    id: string,
    url: string,
    url_large: string,
    artist: string,
    title: string,
    created?: string,
    likes?: number
};

type Props = {
    isLeftMoving: boolean,
    painting: PaintingT,
    showOverlay: (p: PaintingT) => void
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
                    src={this.props.painting.url}
                    style={{ height: "100%", width: "auto", padding: 0 }}
                    className={(this.props.isLeftMoving ? "moveHorizontalLeft" : "moveHorizontalRight") + " painting"}
                    alt="something cool"
                    onClick={() => this.props.showOverlay(this.props.painting)}
                />
            </>
        )
    }

}