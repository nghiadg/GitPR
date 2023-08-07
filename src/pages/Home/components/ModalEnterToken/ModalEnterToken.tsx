import { Octokit } from "@octokit/rest";
import { useCallback, useContext, useState, useEffect } from "react";
import { Button, Form, Modal, ModalProps } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../../stores";
import styles from "./ModalEnterToken.module.css";
import { useSessionStorage } from "../../../../hooks/useSessionStorage";

interface FormVerifyGithubToken {
  token: string;
}

export const ModalEnterToken = ({ ...props }: ModalProps) => {
  const [show, setShow] = useState<boolean>(false);
  const { setOctokit } = useContext(AppContext);
  const { value, setValue, getValue } = useSessionStorage("token", "");
  const { getValues, register } = useForm<FormVerifyGithubToken>({
    defaultValues: {
      token: value,
    },
  });

  const verifyGithubToken = useCallback(
    (token: string) => {
      try {
        const octokit = new Octokit({
          auth: token,
        });
        setOctokit?.(octokit);
        setValue(token);
        setShow(false);
      } catch (error) {
        console.error(error);
      }
    },
    [setOctokit, setValue]
  );

  const submitForm = useCallback(() => {
    const { token } = getValues();
    verifyGithubToken(token);
  }, [getValues, verifyGithubToken]);

  useEffect(() => {
    const token = getValue();
    console.log(token);
    if (!token) {
      setShow(true);
    } else {
      verifyGithubToken(token);
    }
  }, [getValue, verifyGithubToken]);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered backdrop="static">
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
        <Button size="sm" onClick={submitForm}>
          Verify Token
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
