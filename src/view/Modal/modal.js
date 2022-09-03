import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Label, Button } from "reactstrap";
import Webcam from "react-webcam";
import * as actions from "../../config/apiservices";
import { API_PRIVATE_KEY } from "../../config/env";
import { sha256 } from "js-sha256";
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
export const TakePhotoModal = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const returnHash = (payload) => {
    var hash = sha256.hmac.create(API_PRIVATE_KEY);
    hash.update(payload);
    return hash.hex();
  };
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const payload = {
      image: {
        context: "document-front",
        content: imageSrc,
        timestamp: "2019-10-29T06:30:25.597Z",
      },
    };

    setImgSrc(imageSrc);
    const hash = returnHash(JSON.stringify(payload));
    props.setSignature(hash);
    console.log("signature", hash);
    actions
      .postMedia({
        payload: {
          image: {
            context: "document-front",
            content: imageSrc,
            timestamp: "2019-10-29T06:30:25.597Z",
          },
        },
        signature: hash,
        sessionid: props.sessionToken,
      })
      .then((response) => {
        if (response.data.status === "success") {
          props.setImageId(response.data.image.id);
          props.openNext(false, false, true);
        } else {
          alert(response.data.message);
        }
      });
  };

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
export const AfterPhotoModal = (props) => {
  const [img, setimg] = useState("");
  console.log(props);
  const returnHash = (payload) => {
    var hash = sha256.hmac.create(API_PRIVATE_KEY);
    hash.update(payload);
    return hash.hex();
  };
  const openLink = () => {
    const hash = returnHash(props.imageId);
    actions
      .getMedia({
        signature: hash,
        mediaId: props.imageId,
      })
      .then((res) => {
        var b64Response = window.btoa(unescape(encodeURIComponent(res.data)));
        var outputImg = document.createElement("img");
        outputImg.src = "data:image/png;base64," + b64Response;

        setimg("data:image/png;base64," + b64Response);
        document.body.appendChild(outputImg);
      });
  };
  const verify = () => {
    const payload = {
      verification: {
        status: "submitted",
        timestamp: "2023-09-04T06:30:25.597Z",
      },
    };
    const hash = returnHash(JSON.stringify(payload));
    actions
      .verify({ sessionId: props.sessionToken, signature: hash, payload })
      .then((res) => {
        if (res.data) {
          alert(res.data.verification.status);
        }
      });
  };
  return (
    <div>
      <h2>Click on the link to see the picture</h2>
      <Button onClick={openLink}>Open Picture</Button>
      <Button onClick={verify}>Verify</Button>

      {img && <></>}
    </div>
  );
};
// export const
export default VerificationModal;
