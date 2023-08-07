export interface IComment {
	parent_uid?: string;
	uid: string;
	name: string;
	profileColor?: string;
	text: string;
	date: string;
	replies?: IComment[];
}

export const FakeComment6: IComment = {
	parent_uid: "1",
	uid: "3",
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. Dui ut ornare lectus sit amet est placerat. Habitant morbi tristique senectus et. Orci sagittis eu volutpat odio facilisis mauris sit amet. Urna duis convallis convallis tellus. Imperdiet proin fermentum leo vel orci porta. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Senectus et netus et malesuada fames ac. Lobortis mattis aliquam faucibus purus in.",
	name: "Bob",
	date: "27.12.2010",
};
export const FakeComment5: IComment = {
	parent_uid: "1",
	uid: "3",
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. Dui ut ornare lectus sit amet est placerat. Habitant morbi tristique senectus et. Orci sagittis eu volutpat odio facilisis mauris sit amet. Urna duis convallis convallis tellus. Imperdiet proin fermentum leo vel orci porta. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Senectus et netus et malesuada fames ac. Lobortis mattis aliquam faucibus purus in.",
	name: "Bob",
	date: "27.12.2010",
};
export const FakeComment4: IComment = {
	parent_uid: "1",
	uid: "3",
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. Dui ut ornare lectus sit amet est placerat. Habitant morbi tristique senectus et. Orci sagittis eu volutpat odio facilisis mauris sit amet. Urna duis convallis convallis tellus. Imperdiet proin fermentum leo vel orci porta. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Senectus et netus et malesuada fames ac. Lobortis mattis aliquam faucibus purus in.",
	name: "Bob",
	date: "27.12.2010",
};

export const FakeComment3: IComment = {
	parent_uid: "1",
	uid: "3",
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	name: "John",
	date: "27.12.2010",
	replies: [FakeComment4],
};

export const FakeComment2: IComment = {
	parent_uid: "1",
	uid: "2",
	name: "cum sociis natoque penatibus et",
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	date: "27.12.2000",
	replies: [FakeComment3],
};

export const FakeComment: IComment = {
	uid: "1",
	name: "cum sociis natoque penatibus et",
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempus imperdiet nulla malesuada pellentesque elit. Etiam sit amet nisl purus in mollis. Tincidunt praesent semper feugiat nibh sed pulvinar proin. Lacus sed turpis tincidunt id aliquet risus feugiat in.",
	date: "27.12.2020",
	replies: [
		FakeComment2,
		FakeComment3,
		FakeComment4,
		FakeComment2,
		FakeComment3,
		FakeComment4,
		FakeComment2,
		FakeComment3,
		FakeComment4,
	],
};
