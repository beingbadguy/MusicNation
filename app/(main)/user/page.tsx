"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineHeart,
  AiOutlineDelete,
  AiOutlineHistory,
} from "react-icons/ai";
import { MdClearAll } from "react-icons/md";
import { useRouter } from "next/navigation";

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const router = useRouter();

  const handleActionClick = (type: string) => {
    if (type === "favourites") {
      router.push("/favourites"); // ✅ direct redirect
    } else {
      setAction(type); // 🛑 show modal for others
      setModalOpen(true);
    }
  };

  const handleConfirm = () => {
    console.log(`Performing action: ${action}`);
    if (action === "clearHistory") {
      localStorage.removeItem("recentSongsPlayed");
    } else if (action === "clearFavourites") {
      localStorage.removeItem("favouriteSongs");
    } else if (action === "clearAll") {
      localStorage.removeItem("recentSongsPlayed");
      localStorage.removeItem("favouriteSongs");
    }

    setModalOpen(false);
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring" }}
      className="p-4 space-y-4"
    >
      <ActionButton
        icon={<AiOutlineHeart size={20} />}
        text="Favourites"
        onClick={() => handleActionClick("favourites")}
      />
      <ActionButton
        icon={<AiOutlineHistory size={20} />}
        text="Clear History"
        onClick={() => handleActionClick("clearHistory")}
      />
      <ActionButton
        icon={<AiOutlineDelete size={20} />}
        text="Clear Favourites"
        onClick={() => handleActionClick("clearFavourites")}
      />
      <ActionButton
        icon={<MdClearAll size={20} />}
        text="Clear Everything"
        onClick={() => handleActionClick("clearAll")}
      />

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div className="bg-[#135867] w-[300px] text-white p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-lg font-semibold">Are you sure?</h2>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded"
                  onClick={() => setModalOpen(false)}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  onClick={handleConfirm}
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ActionButton = ({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) => (
  <button
    className="w-full flex items-center justify-between gap-3 text-white bg-[#0A2E36] hover:bg-[#135867] rounded-xl transition "
    onClick={onClick}
  >
    <span className="font-[400] text-sm">{text}</span>
    {icon}
  </button>
);

export default Page;
