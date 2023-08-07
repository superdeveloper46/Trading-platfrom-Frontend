import React from "react";
import cn from "classnames";
import styles from "styles/pages/Particles.module.scss";

export const Particles: React.FC = () => (
	<div className={cn(styles.animation_wrapper)}>
		<div className={cn(styles.particle, styles.particle_1)} />
		<div className={cn(styles.particle, styles.particle_2)} />
		<div className={cn(styles.particle, styles.particle_3)} />
		<div className={cn(styles.particle, styles.particle_4)} />
	</div>
);
