import { Col, ColProps, Container, ContainerProps, Row, RowProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";

const UniContainer = <As extends React.ElementType = React.ElementType>(props: React.PropsWithChildren<ReplaceProps<As, BsPrefixProps<As> & ContainerProps>>) => {
    return <Container {...props} ></Container>
};

const UniRow = <As extends React.ElementType = React.ElementType>(props: React.PropsWithChildren<ReplaceProps<As, BsPrefixProps<As> & RowProps>>) => {
    return <Row {...props} ></Row>
};

const UniCol = <As extends React.ElementType = React.ElementType>(props: React.PropsWithChildren<ReplaceProps<As, BsPrefixProps<As> & ColProps>>) => {
    return <Col {...props} ></Col>
};

export { UniCol, UniRow, UniContainer };