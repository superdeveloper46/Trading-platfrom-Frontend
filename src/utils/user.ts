export const AVATAR_COLORS: string[] = [
	"#8D6FD5",
	"#69A9F4",
	"#5C6AC0",
	"#763CDB",
	"#AF6D30",
	"#798F9A",
	"#59B36C",
	"#00887A",
	"#6F7BE9",
	"#A09639",
	"#6193C0",
	"#D5A80A",
	"#68A03E",
	"#D98A5E",
	"#3FA8CA",
	"#55C6CD",
	"#8B6D62",
	"#68A03E",
];

export const getStrHashCode = (str: string): number => {
	let hash = 0;
	let char = 0;
	if (str.length === 0) return hash;
	for (let i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		// eslint-disable-next-line no-bitwise
		hash = (hash << 5) - hash + char;
		// eslint-disable-next-line no-bitwise
		hash |= 0;
	}
	const result = Math.abs(hash);
	return Number.isNaN(result) ? 0 : result;
};

export const getAvatarColor = (username?: string | null): string => {
	if (!username) return "#6d7177";
	const hash = getStrHashCode(username);
	const idx = hash % AVATAR_COLORS.length;

	return AVATAR_COLORS[idx];
};
