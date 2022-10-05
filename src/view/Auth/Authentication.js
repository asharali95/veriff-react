import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import * as actions from "../../config/apiservices";
import {useNavigate,useParams} from "react-router-dom"
const Authentication = () => {
  useEffect(()=>{

  },[])
  const [switcher, setSwitcher] = useState("login");
  const navigate = useNavigate()
 
  return (
    <div>
      <h3>Authentication</h3>
      {switcher === "signup" ? (
        <SignupForm setSwitcher={setSwitcher} navigate={navigate} />
      ) : (
        <LoginForm setSwitcher={setSwitcher} navigate={navigate} />
      )}
     
      
    </div>
  );
};

const LoginForm = (props) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(loginData);
        try {
          actions.login(loginData).then((res) => {
            if (res.data.data) {
              window.localStorage.setItem(
                "auth",
                JSON.stringify(res.data.data.user)
              );
              props.navigate("/app")
            }
          });
        } catch (error) {
          console.log(error);
          alert(error.message);
        }
      }}
    >
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          type="email"
          name="email"
          id="example@gmail.com"
          placeholder="example@gmail.com"
          required
          value={loginData.email}
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          type="password"
          name="password"
          id="examplePassword"
          placeholder="Enter password"
          value={loginData.password}
          onChange={(e) => {
            setLoginData({ ...loginData, password: e.target.value });
          }}
        />
        <p onClick={()=>{
          actions.forgotPassword({email:loginData.email}).then((res)=>{
            if (res.data) {
              alert(res.data.message)
            }
          })
        }}>Forgot password?</p>
      </FormGroup>
      <Button type="submit">Login</Button>
      <p>
        No registered Account?{" "}
        <span
          onClick={() => {
            props.setSwitcher("signup");
          }}
        >
          Signup
        </span>{" "}
        here
      </p>
    </Form>
  );
};
export const ResetForm = (props) =>{
  const {token} = useParams()
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();

          actions.resetPassword(resetData,token).then((res) => {
            console.log(res)
            if (res.data.status==="success") {
              alert(res.data.message)
              window.localStorage.setItem(
                "auth",
                JSON.stringify(res.data.data.user)
              );
              props.navigate("/app")
            }
            else{
              alert(res.data.message)
            }
          });
       
      }}
    >
      <FormGroup>
        <Label for="exampleEmail">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          value={resetData.password}
          onChange={(e) => {
            setResetData({ ...resetData, password: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Confirm password</Label>
        <Input
          type="password"
          name="password"
          id="examplePassword"
          invalid={resetData.password!==resetData.confirmPassword}
          placeholder="Enter confirmed password"
          value={resetData.confirmPassword}
          onChange={(e) => {
            setResetData({ ...resetData, confirmPassword: e.target.value });
          }}
        />

      </FormGroup>
      <Button type="submit">Reset</Button>
      
    </Form>
  );
}
const SignupForm = (props) => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(signupData);
        actions.signup(signupData).then((res) => {
          console.log(res.data);
          if (res.data.data) {
            window.localStorage.setItem(
              "auth",
              JSON.stringify(res.data.data.user)
            );
           
          }
        });
      }}
    >
      <FormGroup>
        <Label for="exampleEmail">FullName</Label>
        <Input
          type="text"
          name="fullName"
          id="fullName"
          value={signupData.fullName}
          onChange={(e) => {
            setSignupData({ ...signupData, fullName: e.target.value });
          }}
          placeholder="Enter full name"
        />
      </FormGroup>
      <FormGroup>
        <Label for="exampleEmail">username</Label>
        <Input
          type="text"
          name="fullName"
          id="fullName"
          value={signupData.username}
          onChange={(e) => {
            setSignupData({ ...signupData, username: e.target.value });
          }}
          placeholder="Enter full name"
        />
      </FormGroup>
      <FormGroup>
        <Label for="exampleEmail">phone number</Label>
        <Input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={signupData.phoneNumber}
          onChange={(e) => {
            setSignupData({ ...signupData, phoneNumber: e.target.value });
          }}
          placeholder="Enter phone Number "
        />
      </FormGroup>
      <FormGroup>
        <Label for="exampleEmail">email address</Label>
        <Input
          type="email"
          name="email"
          id="email"
          value={signupData.email}
          onChange={(e) => {
            setSignupData({ ...signupData, email: e.target.value });
          }}
          placeholder="Enter email address "
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          type="password"
          name="password"
          id="examplePassword"
          placeholder="Enter password"
          onChange={(e) => {
            setSignupData({ ...signupData, password: e.target.value });
          }}
          value={signupData.password}
        />
      </FormGroup>
      <FormGroup>
        <Label for="exampleEmail">Confirm Password</Label>

        <Input
          type="password"
          name="password"
          id="examplePassword"
          placeholder="Enter confirmed password"
          onChange={(e) => {
            setSignupData({ ...signupData, confirmPassword: e.target.value });
          }}
          value={signupData.confirmPassword}
        />
      </FormGroup>
      <Button type="submit">Signup</Button>
      <p>
        Already have an account?{" "}
        <span
          onClick={() => {
            props.setSwitcher("login");
          }}
        >
          Login
        </span>{" "}
        here
      </p>
    </Form>
  );
};
export default Authentication;
