"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Terminal.module.scss";
import { useGameStore } from "@/lib/store";

interface HistoryEntry {
  command: string;
  response: string | React.ReactNode;
}

export default function Terminal() {
  const { operatorId, initializeOperator, setSessionToken } = useGameStore();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { command: "", response: <span className={styles.systemMsg}>AXIOM // COMPILATION.DEFERRED</span> },
    { command: "", response: <span className={styles.systemMsg}>Topology: undefined (73% deferred)</span> },
    { command: "", response: <span className={styles.systemMsg}>Status: observer required for instantiation. Try `help`.</span> }
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeOperator();
  }, [initializeOperator]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let response = "COMMAND NOT RECOGNIZED.";

    switch (trimmed.toLowerCase()) {
      case "help":
        response = "AVAILABLE COMMANDS:\n- help : SHOW THIS MESSAGE\n- tour : SYSTEM OVERVIEW\n- scan : INITIATE LOCAL SCAN\n- identify : PRESENT SIGNATURE TO BASTION\n- clear : CLEAR TERMINAL DISPLAY";
        break;
      case "tour":
        response = "Axiom is an iterative protocol. You are currently at the SURFACE LEVEL.\nDeeper access requires observation and alignment.";
        break;
      case "scan":
        response = `SCANNING... OPERATOR: ${operatorId || "UNKNOWN"}. NO ANOMALIES DETECTED.`;
        break;
      case "identify":
        try {
          const res = await fetch("/api/bastion/identify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operatorId }),
          });
          const data = await res.json();
          if (res.ok) {
            setSessionToken(data.token);
            response = `${data.status}\n${data.message}`;
          } else {
            response = `BASTION REJECTED SIGNATURE: ${data.error}`;
          }
        } catch {
          response = "BASTION UNREACHABLE. CONNECTION FAILED.";
        }
        break;
      case "clear":
        setHistory([]);
        return;
    }

    setHistory((prev) => [...prev, { command: trimmed, response }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminalHeader}>
        <span>AXIOM // COMPILATION.DEFERRED</span>
        <span>ENTROPY: 0.97</span>
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.terminalOutput}>
          {history.map((entry, idx) => (
            <div key={idx} className={styles.historyEntry}>
              {entry.command && (
                <div className={styles.commandLine}>
                  <span className={styles.prompt}>operator@axiom:~$</span>
                  <span className={styles.command}>{entry.command}</span>
                </div>
              )}
              <div className={styles.response}>{entry.response}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className={styles.inputArea}>
          <span className={styles.prompt}>operator@axiom:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            autoFocus
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
