"use client";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/types";

interface IUniTooltip {
  children: any;
  title: any;
  placement?: Placement;
  classTooltip?: any;
  showToolTip?: boolean;
}

const UniTooltip = (props: IUniTooltip) => {
  const { children, title, placement, classTooltip, showToolTip } = props;
  const renderTooltip = (propsTooltip: any) => (
    <Tooltip
      id="uni-tooltip"
      {...propsTooltip}
      className={classTooltip ? `${classTooltip}` : "uni-tooltip-container"}
    >
      {title}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      show={showToolTip}
      placement={placement || "top"}
      delay={{ show: 50, hide: 50 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
};

export default UniTooltip;
