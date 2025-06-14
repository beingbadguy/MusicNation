"use client";
import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
      }}
    >
      This page is under construction
    </motion.div>
  );
};

export default Page;
