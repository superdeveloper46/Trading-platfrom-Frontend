import React, { useEffect, useState } from "react";
import { useMst } from "models/Root";
import { ThemeEnum } from "types/theme";
import { observer } from "mobx-react-lite";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { TwitterTimelineEmbed } from "react-twitter-embed";

interface Props {
	url: string;
	width: number;
	height: number;
}

const TwitterWidget: React.FC<Props> = ({ url, width, height }) => {
	const {
		global: { theme, locale },
	} = useMst();
	const [loading, setLoading] = useState(false);

	const handleOnLoad = () => {
		setLoading(false);
	};

	useEffect(() => {
		setLoading(true);
	}, [url]);

	return (
		<>
			{loading && <LoadingSpinner />}
			<TwitterTimelineEmbed
				key={theme + locale}
				sourceType="url"
				url={url}
				lang={locale}
				theme={theme === ThemeEnum.Light ? "light" : "dark"}
				options={{ height: height, width: width }}
				transparent
				noFooter
				noScrollbar
				noBorders
				onLoad={handleOnLoad}
			/>
		</>
	);
};

export default observer(TwitterWidget);
