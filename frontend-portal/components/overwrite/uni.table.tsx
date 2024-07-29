import Table, { TableProps } from "react-bootstrap/Table";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";

type TTablePros = React.PropsWithChildren<
    ReplaceProps<"table", BsPrefixProps<"table"> & TableProps>
>;
type UniTableProps = {
    customtable?: "type-1" | "type-2" | "type-3";
};

const UniTable = (props: TTablePros & UniTableProps) => {
    if (props.customtable === "type-1") {
        return (
            <div className="uni-table-type-1">
                <Table {...props}></Table>
            </div>
        );
    }
    return <Table {...props}></Table>;
};

export default UniTable;
