import React from "react";

const styleProps = (props: Record<string, string | number | undefined>): React.CSSProperties =>
	props as React.CSSProperties;

export default styleProps;
