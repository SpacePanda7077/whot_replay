import axios from "axios";
import { ENDPOINT } from "./glogal-api";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
} from "firebase/auth";
import { firebaseApp } from "../lib/firebase";

export const SignUp = async (data: {
    full_name: string;
    email: string;
    password: string;
    country: string;
}) => {
    const res = await axios.post(`${ENDPOINT}/api/auth/signup`, data);
    return res.data;
};

export const LogIn = async (data: { email: string; password: string }) => {
    const res = await axios.post(`${ENDPOINT}/api/auth/login`, data);
    return res.data;
};

export const SignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(firebaseApp);
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (!credential) return;
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            console.log(token, user);
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
};

export const SigninWithapple = async () => {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    const auth = getAuth(firebaseApp);
    signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            // Apple credential
            const credential = OAuthProvider.credentialFromResult(result);
            if (!credential) return;
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;

            console.log(accessToken, idToken, user);

            // IdP data available using getAdditionalUserInfo(result)
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The credential that was used.
            const credential = OAuthProvider.credentialFromError(error);

            console.log({
                errorCode,
                errorMessage,
                email,
                credential,
            });

            // ...
        });
};

