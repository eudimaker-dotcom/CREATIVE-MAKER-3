import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  BarChart2,
  Globe,
  Video,
  PlaneTakeoff,
  AudioLines,
  Moon,
  Sun,
} from "lucide-react";

// Hook helper to debounce query typing
function useDebounce(value, delay = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ActionSearchBar({
  navigate,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
}) {
  const [query, setQuery] = useState(searchQuery || "");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 150);

  // Sync internal state with external search query
  useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  // Propagate search query to parent state
  useEffect(() => {
    if (setSearchQuery) {
      setSearchQuery(debouncedQuery);
    }
  }, [debouncedQuery, setSearchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // List of actions customized for Creative Maker 3 / Designali
  const allActions = [
    {
      id: "graficos",
      label: "Navegar para Gráficos",
      icon: <BarChart2 className="h-3.5 w-3.5 text-[#adfa1d]" />,
      description: "Flyers, Mockups, Posters",
      short: "G",
      end: "Página",
      action: () => navigate("/graficos"),
    },
    {
      id: "templates",
      label: "Explorar Templates",
      icon: <Globe className="h-3.5 w-3.5 text-blue-400" />,
      description: "PSD, Figma, Canva, AE",
      short: "T",
      end: "Página",
      action: () => navigate("/templates"),
    },
    {
      id: "fontes",
      label: "Explorar Fontes",
      icon: <AudioLines className="h-3.5 w-3.5 text-pink-400" />,
      description: "Coleções de tipografia",
      short: "F",
      end: "Página",
      action: () => navigate("/fontes"),
    },
    {
      id: "assets",
      label: "Explorar Assets",
      icon: <Send className="h-3.5 w-3.5 text-purple-400" />,
      description: "SVGs, 3D e Gradientes",
      short: "A",
      end: "Página",
      action: () => navigate("/assets"),
    },
    {
      id: "studio-ai",
      label: "Abrir Studio IA",
      icon: <Video className="h-3.5 w-3.5 text-[#adfa1d]" />,
      description: "Gerador de imagens por IA",
      short: "S",
      end: "Ferramenta",
      action: () => navigate("/studio-ai"),
    },
    {
      id: "upload",
      label: "Upload de Recurso",
      icon: <PlaneTakeoff className="h-3.5 w-3.5 text-orange-400" />,
      description: "Publicar novo design",
      short: "U",
      end: "Ação",
      action: () => navigate("/upload"),
    },
    {
      id: "theme",
      label: isDarkMode ? "Alternar Tema Claro" : "Alternar Tema Escuro",
      icon: isDarkMode ? (
        <Sun className="h-3.5 w-3.5 text-yellow-400" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-indigo-400" />
      ),
      description: isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro",
      short: "D",
      end: "Tema",
      action: () => setIsDarkMode(!isDarkMode),
    },
  ];

  // Filter actions based on typed query
  const filteredActions = allActions.filter((action) => {
    const term = query.toLowerCase().trim();
    if (!term) return true;
    return (
      action.label.toLowerCase().includes(term) ||
      action.description.toLowerCase().includes(term)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const handleActionClick = (action) => {
    action.action();
    setSelectedAction(action);
    setIsFocused(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative" style={{ width: "160px" }}>
      {/* Search Input Container */}
      <div
        className="flex-center"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "9999px",
          padding: "6px 14px",
          backgroundColor: isFocused
            ? "rgba(255, 255, 255, 0.07)"
            : "rgba(255, 255, 255, 0.03)",
          gap: "8px",
          transition: "var(--transition-smooth)",
        }}
      >
        <Search size={13} style={{ color: "#a8a29e" }} />
        <input
          type="text"
          placeholder="Comandos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setSelectedAction(null);
            setIsFocused(true);
          }}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "0.75rem",
            color: "#ffffff",
            width: "100%",
          }}
        />
        <div style={{ width: "12px", height: "12px", display: "flex", alignItems: "center" }}>
          <AnimatePresence mode="popLayout">
            {query.length > 0 && (
              <motion.div
                key="send"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <Send size={11} style={{ color: "var(--accent-color)" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating command dropdown */}
      <AnimatePresence>
        {isFocused && filteredActions.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="glass-panel"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "300px",
              backgroundColor: "rgba(12, 10, 9, 0.98)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "6px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.75)",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {filteredActions.map((action) => (
                <li
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                  }}
                  className="hover-action-item"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {action.icon}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#ffffff",
                        }}
                      >
                        {action.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "#a8a29e",
                        }}
                      >
                        {action.description}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {action.short && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          color: "#78716c",
                          backgroundColor: "rgba(255, 255, 255, 0.04)",
                          padding: "1px 5px",
                          borderRadius: "4px",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        {action.short}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "0.6rem",
                        color: "#a8a29e",
                        whiteSpace: "nowrap",
                        opacity: 0.7,
                      }}
                    >
                      {action.end}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: "6px",
                padding: "6px 8px 2px 8px",
                borderTop: "1px dotted rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.6rem",
                color: "#78716c",
              }}
            >
              <span>Selecione para navegar</span>
              <span>ESC para cancelar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
