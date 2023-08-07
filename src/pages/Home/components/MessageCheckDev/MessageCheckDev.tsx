import React, { useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "./MessageCheckDev.module.css";
import clsx from "clsx";

export interface MessageCheckDevProps {
  message: string;
  jiraUrls: string[]
}

export const MessageCheckDev = ({ message, jiraUrls }: MessageCheckDevProps) => {
  const copyMessage = useCallback(() => {
    navigator.clipboard.writeText(message);
  }, [message]);

  const openJiraUrls = useCallback(() => {
    jiraUrls.forEach((url) => {
        window.open(url, "_blank")
    })
  }, [jiraUrls])

  return (
    <div className="h-100 d-flex flex-column">
      <div className="mb-3 d-flex justify-content-end gap-2">
        <Button size="sm" onClick={copyMessage}>Copy Message</Button>
        <Button size="sm" onClick={openJiraUrls}>Open Jira</Button>
      </div>
      <Card className={clsx("p-2 flex-fill", styles.msgContent)}>
        {message}
      </Card>
    </div>
  );
};
