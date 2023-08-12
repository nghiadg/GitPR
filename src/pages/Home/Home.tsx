import React, { useCallback, useState } from "react";
import { ModalEnterToken, PullRequestsSection } from "./components";
import { MessageCheckDev } from "./components";
import styles from "./Home.module.css";
import clsx from "clsx";

const Home = () => {
  const [message, setMessage] = useState<string>("");
  const [jiraUrls, setJiraUrls] = useState<string[]>([]);

  const generateMessage = useCallback((msg: string, urls: string[]) => {
    setMessage(msg);
    setJiraUrls(urls);
  }, []);

  return (
    <>
      <main className={clsx("container-fluid py-3 d-flex gap-4 vh-100", styles.container)}>
        <PullRequestsSection onGenerateMessage={generateMessage} />
        <MessageCheckDev message={message} jiraUrls={jiraUrls} />
      </main>
      <ModalEnterToken />
    </>
  );
};

export default Home;
