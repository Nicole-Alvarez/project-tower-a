import { motion } from "framer-motion"
import type { PropsWithChildren, ReactNode } from "react";

type Props = {
  delay?: number;
  className?: string;
  animation:
  "EaseInTop" | "EaseInLeft"
  | "FadeIn" | "EaseInRight"
  | "Hover" | "SlideDown"
  | "Bubble" | "SlideFromRight"
  | "SlideFromLeft" | "FadeInText"
  | "Shake" | "ZoomIn" | "SlideUp" | "HoverSlideUp" | "FadeOut" |"";
  children: ReactNode;
  duration?: number;
  scale?: number;
}

const AnimatedDiv = (props: PropsWithChildren<Props>) => {
  switch (props.animation) {
    case "EaseInTop":
      return EaseInTop({ ...props })
    case "EaseInLeft":
      return EaseInLeft({ ...props })
    case "EaseInRight":
      return EaseInRight({ ...props })
    case "FadeIn":
      return FadeIn({ ...props })
      case "FadeOut":
      return FadeOut({ ...props })
    case "Hover":
      return Hover({ ...props })
    case "SlideDown":
      return SlideDown({ ...props })
    case "SlideUp":
      return SlideUp({ ...props })
    case "Bubble":
      return Bubble({ ...props });
    case "SlideFromLeft":
      return SlideFromLeft({ ...props });
    case "SlideFromRight":
      return SlideFromRight({ ...props });
    case "FadeInText":
      return <FadeInText text={props.children as string}
        className={props.className} delay={props.delay}
        duration={props.duration}
      />;
    case "Shake":
      return Shake({ ...props });
    case "ZoomIn":
      return ZoomIn({ ...props });
    case "HoverSlideUp":
      return HoverSlideUp({ ...props });



    default:
      return <div>{props.children}</div>
  }
}

const EaseInTop = ({ className, delay, children }: Props) => {
  return <motion.div className={className}
    animate={{ y: [-20, 0], opacity: [0, 1] }}
    transition={{ ease: "easeIn", duration: 0.5, delay }}
  >
    {children}
  </motion.div>
}

const EaseInLeft = ({ className, delay, children }: Props) => {
  return <motion.div className={className}
    animate={{ x: [-20, 0], opacity: [0, 1] }}
    transition={{ ease: "easeIn", duration: 0.5, delay }}
  >
    {children}
  </motion.div>
}

const EaseInRight = ({ className, delay, children }: Props) => {
  return <motion.div className={className}
    animate={{ x: [20, 0], opacity: [0, 1] }}
    transition={{ ease: "easeIn", duration: 0.5, delay }}
  >
    {children}
  </motion.div>
}

const FadeIn = ({ className, delay, children }: Props) => {
  return <motion.div className={className}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.8,
      delay: 0.5,
      ease: [0, 0.71, 0.2, 1.01]
    }}
  >
    {children}
  </motion.div>
}

const Hover = ({ className, children }: Props) => {
  return <motion.div className={className}
    whileHover={{ scale: 1.105 }}
  >
    {children}
  </motion.div>

}
const SlideDown = ({ className, children, delay, duration }: Props) => {
  return <motion.div
    className={className}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: duration ?? 0.2, ease: 'easeInOut', delay }}
  >
    {children}
  </motion.div>

}
const SlideUp = ({ className, children, delay, duration }: Props) => {
  return <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: duration ?? 0.2, ease: 'easeInOut', delay }}
  >
    {children}
  </motion.div>

}
const Bubble = ({ className, children, scale }: Props) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: scale ?? 1.1, borderRadius: "50%" }}
      transition={{ type: "linear", stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}

const HoverSlideUp = ({ className, children, scale }: Props) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: scale ?? 1.1,
        y: -10,
        borderRadius: "50%"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  );
};
const SlideFromLeft = ({ className, children, delay, duration }: Props) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: duration ?? 1, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
};

const SlideFromRight = ({ className, children, delay, duration }: Props) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: duration ?? 1, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
};



const container = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: 1,
      delayChildren: delay,
    },
  }),
};

const item = (duration: number) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, y: [0, -20, 0], transition: { duration } },
}
);

type FadeInTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}
  ;

const FadeInText: React.FC<FadeInTextProps> = ({ text, className = "", delay = 0, duration = 0.5 }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      custom={delay}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={item(duration)}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Shake = ({ className, delay, children }: Props) => {
  return (
    <motion.div
      className={className}
      animate={{ x: ["0%", "-10%", "10%", "-10%", "10%", "0%"] }}
      transition={{
        repeat: Infinity, duration: 0.4, ease: "linear", delay,
        repeatDelay: 2
      }}
    >
      {children}
    </motion.div>
  );
};
const ZoomIn = ({ className, delay, duration, children }: Props) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: duration ?? 0.5, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
};

const FadeOut = ({ className, delay, duration, children }: Props) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0 }}   
      transition={{ duration: duration ?? 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedDiv
