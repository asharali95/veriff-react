import React from "react";
import { Modal, ModalHeader, ModalBody, Label, Button } from "reactstrap";
import Webcam from "react-webcam";
import * as actions from "../../config/apiservices";
const VerificationModal = (props) => {
  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleModal}></ModalHeader>
      <ModalBody>
        <Label tag={"h2"}>Let's get you verified</Label>
        <Label tag={"h4"}>Before you start, please:</Label>
        <div>
          <ul>
            <li>Prepare a valid government-issued identity document</li>
            <li>Check if your device’s camera is uncovered and working</li>
            <li>Be prepared to take a selfie and photos of your ID</li>
          </ul>
        </div>
        <Button
          color="primary"
          onClick={() => {
            actions
              .createSession({
                verification: {
                  callback: "https://veriff.com",
                  person: {
                    firstName: "John",
                    lastName: "Doe",
                    idNumber: "031245678",
                  },
                  document: {
                    number: "D09090909",
                    type: "PASSPORT",
                    country: "PK",
                  },
                  vendorData: "22222222",
                  timestamp: new Date(Date.now()).toISOString(),
                },
              })
              .then((res) => {
                if (res.status > 200 && res.status < 299) {
                  props.setSessionToken(res.data.verification.id);
                  props.openNext(false, true, false);
                } else {
                  alert("Session Token not created! Kindly check error");
                }
              });
          }}
        >
          Get Started
        </Button>
      </ModalBody>
    </Modal>
  );
};
export const TakePhotoModal = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log(imageSrc);
  }, [webcamRef, setImgSrc]);

  return (
    <div>
      <h2>Take a photo of your document’s photo page</h2>
      <p>Accepted documents: passport, ID card, driver's license.</p>

      <>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button onClick={capture}>Capture photo</button>
        {imgSrc && <img src={imgSrc} />}
      </>
    </div>
  );
};
export default VerificationModal;
