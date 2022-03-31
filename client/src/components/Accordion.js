import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Accordion = ({ menuName, children }) => {
  const [expanded, setExpanded] = useState(true);
  const isOpen = menuName === expanded;

  return (
    <>
      <motion.header
        style={{ fontSize: '1.5em', color: 'black', height: '40px', backgroundColor: 'blue', borderRadius: '5px', margin: '10px 0px 10px 0px' }}
        animate={{ backgroundColor: isOpen ? "#FF0088" : "#bdbdbd" }}
        initial={false}
        onClick={() => setExpanded(isOpen ? false : menuName)}
      >
        {menuName}
        <span style={{
          fontSize: '.75em', width: '95%', textAlign: 'right'
        }}>
          {isOpen ? <span>        ▼</span> : <span>        ►</span>}
        </span>
      </motion.header>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.5] }}
          >
            {children}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}

export default Accordion;