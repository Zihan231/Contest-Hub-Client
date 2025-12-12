import React, { useEffect, useState } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import AuthContext from '../AuthContext/AuthContext'
import { auth } from '../../firebase/firebase.config';
const AuthProvider = ({ children }) => {
    const [user, SetUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const provider = new GoogleAuthProvider();

    //   Login
    const signInWithEmailPass = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }
    // SignOut 
    const logout = () => {
        return signOut(auth);
    }
    // Google Sign-In
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            await result.user.reload();
            SetUser(result.user);
            return result;
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            throw error;
        }
    };
    // Create new user (email + pass)
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };
    

    // Update user profile manually
    const Update = (data) => {
        return updateProfile(auth.currentUser, data);
    };
    // Auth state listener
        useEffect(() => {
            const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
                SetUser(currentUser);
                setIsLoading(false);
            });
            return () => unSubscribe();
        }, []);
    const userInfo = {
        user,
        SetUser,
        signInWithEmailPass,
        logout,
        signInWithGoogle,
        createUser,
        Update,
        isLoading
    }
    return (
        <AuthContext value={userInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;