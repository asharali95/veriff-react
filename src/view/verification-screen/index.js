import React, { useState } from "react";
import { Button, Label } from "reactstrap";
import VerificationModal, {
  TakePhotoModal,
  AfterPhotoModal,
  DecisionModal,
} from "../Modal/modal";

const VerificationScreen = () => {
  const [modal, setModal] = useState({
    modal1: false,
    modal2: false,
    modal3: false,
    modal4: false,
  });
  const [sessionToken, setSessionToken] = useState(null);
  const [imageId, setImageId] = useState("");
  const [signature, setSignature] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  return (
    <div>
      <Label tag={"h1"}>This is demo app</Label>
      <Button
        color="primary"
        outline
        onClick={() =>
          setModal({
            modal1: true,
            modal2: false,
            modal3: false,
            modal4: false,
          })
        }
      >
        Verify it now
      </Button>
      {modal.modal1 && (
        <VerificationModal
          open={modal.modal1}
          openNext={(modal1, modal2, modal3) =>
            setModal({ modal1: modal1, modal2: modal2, modal3: modal3 })
          }
          handleModal={() => {
            setModal({ modal1: true, modal2: false, modal3: false });
          }}
          setSessionToken={(id) => {
            setSessionToken(id);
          }}
          sessionToken={sessionToken}
        />
      )}
      {modal.modal2 && (
        <TakePhotoModal
          open={modal.modal2}
          sessionToken={sessionToken}
          setSignature={setSignature}
          handleModal2={() => {
            setModal({ modal1: false, modal2: false, modal3: false });
          }}
          openNext={(modal1, modal2, modal3) =>
            setModal({ modal1: modal1, modal2: modal2, modal3: modal3 })
          }
          setImageId={setImageId}
        />
      )}
      {modal.modal3 && (
        <AfterPhotoModal
          imageId={imageId}
          signature={signature}
          sessionToken={sessionToken}
          openNext={(modal1, modal2, modal3, modal4) =>
            setModal({
              modal1: modal1,
              modal2: modal2,
              modal3: modal3,
              modal4: modal4,
            })
          }
          setSuccess={setSuccess}
        />
      )}
      {isSuccess && (
        <DecisionModal
          open={modal.modal4}
          sessionToken={sessionToken}
          handleModal={() => {
            setModal({
              modal1: false,
              modal2: false,
              modal3: true,
              modal4: false,
            });
          }}
        />
      )}
    </div>
  );
};

export default VerificationScreen;
