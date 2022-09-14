import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Button,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
  Input,
} from "reactstrap";
import Webcam from "react-webcam";
import * as actions from "../../config/apiservices";
import { API_PRIVATE_KEY } from "../../config/env";
import { sha256 } from "js-sha256";
const VerificationModal = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentType, setDocumentType] = useState({
    name: "Passport",
    type: "PASSPORT",
  });
  const dropDownItem = [
    { name: "Passport", type: "PASSPORT" },
    { name: "ID Card", type: "ID_CARD" },
    { name: "Drivers License", type: "DRIVERS_LICENSE" },
    { name: "Residence Permit", type: "RESIDENCE_PERMIT" },
  ];
  const [vendorData, setVendorData] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    actions
      .createSession({
        verification: {
          callback: "https://veriff.com",
          person: {
            firstName: firstName,
            lastName: lastName,
            idNumber: idNumber,
          },
          document: {
            number: documentNumber,
            type: documentType.type,
            country: "PK",
          },
          vendorData: vendorData,
          timestamp: new Date(Date.now()).toISOString(),
        },
      })
      .then((res) => {
        if (res.status > 200 && res.status < 299) {
          props.setSessionToken(res.data.verification.id);
          props.openNext(false, true, false, false);
        } else {
          alert("Session Token not created! Kindly check error");
        }
      });
  };
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
        <Row tag="form" onSubmit={handleSubmit} className="mt-3">
          <Col xs={12} md={6}>
            <Label>First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              type="text"
              required
            />
          </Col>
          <Col xs={12} md={6}>
            <Label>Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              type="text"
              required
            />
          </Col>
          <Col xs={12} md={6}>
            <Label>Id Number</Label>
            <Input
              value={idNumber}
              onChange={(e) => {
                setIdNumber(e.target.value);
              }}
              type="text"
              required
            />
          </Col>
          <Col xs={12} md={6}>
            <Label>Vendor Data</Label>
            <Input
              value={vendorData}
              onChange={(e) => {
                setVendorData(e.target.value);
              }}
              type="text"
              required
            />
          </Col>
          <Col xs={12} md={6}>
            <Label>Document Type</Label>
            <UncontrolledButtonDropdown>
              <DropdownToggle color="secondary" caret outline>
                <span className="align-middle ms-50">Document Type</span>
              </DropdownToggle>
              <DropdownMenu>
                {dropDownItem?.map((item) => (
                  <DropdownItem
                    key={item.type}
                    onClick={() => {
                      setDocumentType({
                        name: item.name,
                        type: item.type,
                      });
                    }}
                  >
                    <span className="align-middle ms-50">{item.name}</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </Col>
          <Col xs={12} md={6}>
            <Label>Document Number</Label>
            <Input
              value={documentNumber}
              onChange={(e) => {
                setDocumentNumber(e.target.value);
              }}
              type="text"
              required
            />
          </Col>
          <Button className="mt-3" color="primary" type="submit">
            Get Started
          </Button>
        </Row>
      </ModalBody>
    </Modal>
  );
};
export const TakePhotoModal = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [context, setContext] = React.useState({
    name: "Document Front",
    context: "document-front",
  });
  const returnHash = (payload) => {
    var hash = sha256.hmac.create(API_PRIVATE_KEY);
    hash.update(payload);
    return hash.hex();
  };
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const payload = {
      image: {
        context: context.context,
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
            context: context.context,
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
        } else {
          alert(response.data.message);
        }
      });
  };

  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleModal}></ModalHeader>

      <ModalBody>
        <div
          className="d-flex flex-column align-items-center"
          style={{ textAlign: "center" }}
        >
          <UncontrolledButtonDropdown>
            <DropdownToggle color="secondary" caret outline>
              <span className="align-middle ms-50">Document Context</span>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                className="w-100"
                onClick={() => {
                  setContext({
                    name: "Document Front",
                    context: "document-front",
                  });
                }}
              >
                <span className="align-middle ms-50">Document Front</span>
              </DropdownItem>
              <DropdownItem
                className="w-100"
                onClick={() => {
                  setContext({
                    name: "Document Back",
                    context: "document-back",
                  });
                }}
              >
                <span className="align-middle ms-50">Document Back</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <h2 className="pt-4">Take a photo of your document’s photo page</h2>
          <p>Accepted documents: passport, ID card, driver's license.</p>
          <h5>Context: {context.name}</h5>
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: "400px", height: "400px" }}
            />
            <button className="btn verifynow" onClick={capture}>
              Capture photo
            </button>
            {imgSrc && (
              <button
                className="btn verifynow my-2"
                onClick={() => {
                  props.openNext(false, false, true, false);
                }}
              >
                Next step
              </button>
            )}
            {imgSrc && <img src={imgSrc} />}
          </>
        </div>
      </ModalBody>
    </Modal>
  );
};

const ImageList = ({ image }) => {
  const [img, setImg] = useState("");

  const returnHash = (payload) => {
    var hash = sha256.hmac.create(API_PRIVATE_KEY);
    hash.update(payload);
    return hash.hex();
  };
  const getImage = () => {
    let hash = returnHash(image.id);
    actions.getMedia({ mediaId: image.id, signature: hash }).then((res) => {
      if (res.data) {
        setImg(
          `data:image/png;base64, ${window.btoa(
            unescape(encodeURIComponent(res.data))
          )}`
        );
      }
    });
  };
  return (
    <div>
      <h3>{image.context}</h3>
      <Button onClick={getImage}>View Document</Button>
      {img && <img width={400} height={400} src={img} />}
    </div>
  );
};
export const AfterPhotoModal = (props) => {
  const [img, setimg] = useState("");
  const [allImages, setAllImages] = useState([]);
  const returnHash = (payload) => {
    var hash = sha256.hmac.create(API_PRIVATE_KEY);
    hash.update(payload);
    return hash.hex();
  };
  useEffect(() => {
    actions
      .getAllMediaFromSession({ sessionId: props.sessionToken })
      .then((res) => {
        if (res.data) {
          console.log(res.data.images);
          setAllImages(res.data.images);
        }
      });
  }, []);
  console.log(props);

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
          alert(res.data.status);
          if (res.data.status === "success") {
            props.setSuccess(true);
            props.openNext(false, false, false, true);
          }
        }
      });
  };
  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleModal}></ModalHeader>
      <ModalBody style={{ maxHeight: "600px", overflowY: "scroll" }}>
        <div>
          <h3 style={{ textAlign: "center" }}>
            Click on the link to see the picture
          </h3>
          <div className="d-flex justify-content-between flex-column">
            {allImages?.map((item) => (
              <ImageList image={item} />
            ))}
            {/* <Button onClick={openLink}>Open Picture</Button> */}
            <Button onClick={verify} color="primary" className="mt-3">
              Verify
            </Button>

            {img && <></>}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export const DecisionModal = (props) => {
  const [verification, setVerification] = useState(null);
  const returnHash = (payload) => {
    var hash = sha256.hmac.create(API_PRIVATE_KEY);
    hash.update(payload);
    return hash.hex();
  };

  const decisionCheck = () => {
    const hash = returnHash(props.sessionToken);
    actions
      .getDecision({
        sessionId: props.sessionToken,
        signature: hash,
      })
      .then((res) => {
        if (res && res.data) {
          console.log("ajajaja", res);
          setVerification(res.data.verification);
        }
      });
  };
  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleModal}></ModalHeader>
      <ModalBody>
        <h1>Check Decision of session</h1>
        <Button onClick={decisionCheck}>Check it now!</Button>
        {verification ? (
          <div>
            <h1>{verification?.status}</h1>
            <div className="d-flex justify-content-between">
              <p>Reason:{verification?.reason}</p>
              <p>Decision Taken on:{verification?.decisionTime}</p>
            </div>
            <hr />
            <h1>Document</h1>
            <p>Document Type: {verification?.document?.documentType}</p>
            <p>Number: {verification?.document?.number}</p>
            <p>Country: {verification?.document?.country}</p>
            <hr />
            <h1>Person</h1>
            <p>
              Full Name: {verification?.person?.firstName}{" "}
              {verification?.person?.lastName}
            </p>
            <p>Number: {verification?.person?.number}</p>
            <p>Country: {verification?.person?.country}</p>
          </div>
        ) : (
          <p>The decision has not been made yet. Please wait...</p>
        )}
      </ModalBody>
    </Modal>
  );
};
// export const
export default VerificationModal;
