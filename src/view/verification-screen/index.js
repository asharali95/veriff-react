import React, { useEffect, useState } from "react";
import { Button, Label } from "reactstrap";
import "../verification-screen/main.css";
import VerificationModal, {
  TakePhotoModal,
  AfterPhotoModal,
  DecisionModal,
} from "../Modal/modal";
import {useNavigate} from "react-router-dom"

const VerificationScreen = () => {
  const navigate = useNavigate()

  useEffect(()=>{
    var auth = window.localStorage.getItem("auth");
    if(!auth){
      navigate("/")
    }
  },[])

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
      <div className=" container text-center">
        <Label tag={"h1"}>This is demo app</Label>
        <Button
          className="verifynow"
          color="dark"
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
         <Button
        color="primary"
        outline
        onClick={() => {
          window.localStorage.removeItem("auth");
          navigate("/")
        }}
      >
        Sign out
      </Button>
      </div>
      {modal.modal1 && (
        <VerificationModal
          open={modal.modal1}
          openNext={(modal1, modal2, modal3, modal4) =>
            setModal({
              modal1: modal1,
              modal2: modal2,
              modal3: modal3,
              modal4: modal4,
            })
          }
          handleModal={() => {
            setModal({
              modal1: false,
              modal2: false,
              modal3: false,
              modal4: false,
            });
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
            setModal({
              modal1: false,
              modal2: false,
              modal3: false,
              modal4: false,
            });
          }}
          openNext={(modal1, modal2, modal3, modal4) =>
            setModal({
              modal1: modal1,
              modal2: modal2,
              modal3: modal3,
              modal4: modal4,
            })
          }
          setImageId={setImageId}
        />
      )}
      {modal.modal3 && (
        <AfterPhotoModal
          imageId={imageId}
          signature={signature}
          sessionToken={sessionToken}
          open={modal.modal3}
          handleModal={() => {
            setModal({
              modal1: false,
              modal2: false,
              modal3: false,
              modal4: false,
            });
          }}
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
