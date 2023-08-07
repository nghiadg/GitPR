import { Octokit } from "@octokit/rest";
import { useCallback, useContext } from "react";
import { Button, Form, Modal, ModalProps } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../../stores";
import styles from "./ModalEnterToken.module.css";

interface FormVerifyGithubToken {
  token: string;
}

export const ModalEnterToken = ({show, onHide, ...props}: ModalProps) => {
  const { setOctokit } = useContext(AppContext);
  const { getValues, register } = useForm<FormVerifyGithubToken>({
    defaultValues: {
      token: "",
    },
  });

  const verifyGithubToken = useCallback(() => {
    const { token } = getValues();
    try {
      const octokit = new Octokit({
        auth: token,
      });
      setOctokit?.(octokit);
      onHide?.();
    } catch (error) {
      console.error(error);
    }
  }, [getValues, onHide, setOctokit]);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header className="p-2">
        <span className={styles.heading}>Verify Token</span>
      </Modal.Header>
      <Modal.Body>
        <form action="">
          <Form.Group>
            <Form.Label>Github Token</Form.Label>
            <Form.Control
              {...register("token")}
              as="textarea"
              rows={3}
              placeholder="Enter your github token..."
            />
          </Form.Group>
        </form>
      </Modal.Body>
      <Modal.Footer className="p-1">
        <Button size="sm" onClick={verifyGithubToken}>
          Verify Token
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
