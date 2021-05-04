import { FC } from 'react'
import { motion, Transition, Variants } from 'framer-motion'
import styles from './menu-toggle.module.css'

type PathProps = {
  variants: Variants
  transition?: Transition | undefined
  d?: string | undefined
}

const Path: FC<PathProps> = ({ variants, transition, d }) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    variants={variants}
    transition={transition}
    d={d}
  />
)

type MenuToggleProps = {
  toggle: VoidFunction
}

const MenuToggle: FC<MenuToggleProps> = ({ toggle }) => (
  <button onClick={toggle} type="button" className={styles.menuToggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
)

export default MenuToggle
