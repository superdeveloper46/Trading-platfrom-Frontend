import { useMst } from "models/Root";
import styles from "styles/components/UI/Comments.module.scss";
import React, { useState } from "react";
import classnames from "classnames";
import InternalLink from "components/InternalLink";
import { IComment } from "types/comment";
import styleProps from "utils/styleProps";

interface IProps {
	comments: IComment[];
}

const commentCount = (comments: IComment[]) => {
	let result = 0;
	comments.forEach((comment) => {
		result += 1;
		if (comment.replies) {
			result += commentCount(comment.replies);
		}
	});
	return result;
};

export const Comments: React.FC<IProps> = ({ comments }) => (
	<div className={classnames(styles.Comments, "aa-fade-in")}>
		<span className={styles.Title}>Comments ({commentCount(comments)})</span>
		<LoginComment />
		{comments.map((comment, index) => (
			<Comment key={index} comment={comment} level={0} />
		))}
	</div>
);

export const LoginComment: React.FC = () => (
	<div className={styles.Container}>
		<div
			className={classnames(styles.Avatar, styles.small)}
			style={styleProps({ "--ui-profile-avatar-background": "#9E9E9E" })}
		>
			<i className="ai ai-avatar" />
		</div>
		<div className={styles.Login}>
			<i className="ai ai-chat" />
			<span>
				Что бы оставлять коментарии, пожалуйста, выполните&nbsp;
				<InternalLink to="#">Вход</InternalLink>
			</span>
		</div>
	</div>
);

interface ICommentProps {
	level: number;
	comment: IComment;
}

export const Comment: React.FC<ICommentProps> = ({
	level,
	comment: { profileColor, name, text, date, replies },
}) => {
	const [show, setShow] = useState<boolean>(false);
	const toggle = () => setShow(!show);

	const count = replies && commentCount(replies);

	const renderReplies = () => {
		if (replies == null || replies.length === 0) return null;
		return replies.map((reply, index) => <Comment key={index} level={level + 1} comment={reply} />);
	};

	return (
		<>
			<div
				className={classnames(styles.Container, "aa-fade-in")}
				style={styleProps({ "--level": `${level ? 4 * level : 4}%` })}
			>
				<div
					className={styles.Avatar}
					style={styleProps({ "--ui-profile-avatar-background": profileColor ?? "#9E9E9E" })}
				>
					<i className="ai ai-avatar" />
				</div>
				<div className={styles.Comment}>
					<div className={styles.Header}>
						<span className={styles.Name}>{name}</span>
						<span className={styles.Date}>{date}</span>
					</div>
					<div className={styles.Text}>{text}</div>
					<div className={styles.Footer}>
						{replies && (
							<div className={styles.Action} onClick={toggle}>
								<i className={`ai ai-${show ? "eye_disabled" : "eye"}`} />
								<span>
									{show
										? `Hide ${(count ?? 0) > 1 ? "replies" : "reply"}`
										: `Show ${count} ${(count ?? 0) > 1 ? "replies" : "reply"}`}
								</span>
							</div>
						)}
						<div className={classnames(styles.Action, styles.Reply)}>
							<i className="ai ai-message_square" />
							<span>Reply</span>
						</div>
					</div>
				</div>
			</div>
			{show && renderReplies()}
		</>
	);
};
