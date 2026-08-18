"use client";

import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserPlus,
  Users,
} from "lucide-react";

import { useState } from "react";
import { notification } from "antd";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/components/lib/firebase";

export default function AuthModal({ open, onClose }) {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState("login");

  const [showPass, setShowPass] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [referralUserID, setReferralUserID] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [api, contextHolder] =
    notification.useNotification();

  if (!open) return null;

  // ==========================================
  // Generate 8 Digit User ID
  // ==========================================

  const generateUserID = () => {
    return String(
      Math.floor(
        10000000 +
          Math.random() * 90000000
      )
    );
  };

  // ==========================================
  // Find Referrer By User ID
  // ==========================================

  const findReferrer = async (
    userID
  ) => {
    const usersQuery = query(
      collection(db, "users"),
      where("userID", "==", userID)
    );

    const snapshot = await getDocs(
      usersQuery
    );

    if (snapshot.empty) {
      return null;
    }

    const referrerDoc =
      snapshot.docs[0];

    return {
      uid: referrerDoc.id,
      ...referrerDoc.data(),
    };
  };

  // ==========================================
  // Create Unique User ID
  // ==========================================

  const createUniqueUserID = async (
    transaction
  ) => {
    let attempts = 0;

    while (attempts < 20) {
      const newUserID =
        generateUserID();

      const userIDRef = doc(
        db,
        "userIDs",
        newUserID
      );

      const existing =
        await transaction.get(
          userIDRef
        );

      if (!existing.exists()) {
        transaction.set(userIDRef, {
          userID: newUserID,
          createdAt:
            serverTimestamp(),
        });

        return newUserID;
      }

      attempts++;
    }

    throw new Error(
      "Unable to generate a unique User ID. Please try again."
    );
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async () => {
    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      api.error({
        message: "Login Error",
        description:
          "Email and Password are required.",
      });

      return;
    }

    setLoading(true);

    try {
      // --------------------------------------
      // Firebase Authentication
      // --------------------------------------

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const firebaseUser =
        userCredential.user;

      // --------------------------------------
      // Get Firestore User
      // --------------------------------------

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userSnapshot =
        await getDocs(
          query(
            collection(db, "users"),
            where(
              "uid",
              "==",
              firebaseUser.uid
            )
          )
        );

      if (userSnapshot.empty) {
        // No user profile found
        api.error({
          message: "Account Error",
          description:
            "User profile was not found.",
        });

        return;
      }

      const userData =
        userSnapshot.docs[0].data();

      // --------------------------------------
      // Status Check
      // --------------------------------------

      if (
        userData.status !==
        "active"
      ) {
        api.error({
          message: "Account Inactive",
          description:
            "Your account is currently inactive. Please contact support.",
        });

        // Immediately sign out because
        // Firebase authentication succeeded
        // but application access is blocked.
        await auth.currentUser &&
          import("firebase/auth").then(
            async ({ signOut }) => {
              await signOut(auth);
            }
          );

        return;
      }

      // --------------------------------------
      // Login Success
      // --------------------------------------

      api.success({
        message: "Login Successful",
        description:
          "Welcome back!",
      });

      setEmail("");
      setPassword("");

      onClose();

      // --------------------------------------
      // Admin / User Redirect
      // --------------------------------------

      if (userData.roll === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      let message =
        "Authentication failed.";

      if (
        error?.code ===
        "auth/invalid-credential"
      ) {
        message =
          "Invalid email or password.";
      }

      if (
        error?.code ===
        "auth/user-not-found"
      ) {
        message =
          "No account found with this email.";
      }

      if (
        error?.code ===
        "auth/wrong-password"
      ) {
        message =
          "Incorrect password.";
      }

      api.error({
        message: "Login Failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SIGNUP
  // ==========================================

  const handleSignup = async () => {
    const cleanEmail =
      email.trim().toLowerCase();

    const cleanReferralID =
      referralUserID.trim();

    if (!cleanEmail || !password) {
      api.error({
        message: "Signup Error",
        description:
          "Email and Password are required.",
      });

      return;
    }

    if (password.length < 6) {
      api.error({
        message: "Signup Error",
        description:
          "Password must be at least 6 characters.",
      });

      return;
    }

    setLoading(true);

    try {
      // ======================================
      // 1. Find Referrer
      // ======================================

      let referrer = null;

      if (cleanReferralID) {
        referrer =
          await findReferrer(
            cleanReferralID
          );

        if (!referrer) {
          api.error({
            message:
              "Invalid Referral ID",
            description:
              "No user was found with this Referral User ID.",
          });

          setLoading(false);
          return;
        }

        // Prevent weird self-reference
        // although new account UID is not
        // known yet, so this is mostly
        // defensive.
      }

      // ======================================
      // 2. Create Firebase Auth Account
      // ======================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const firebaseUser =
        userCredential.user;

      const uid =
        firebaseUser.uid;

      // ======================================
      // 3. Create Firestore Data
      // ======================================

      const userRef = doc(
        db,
        "users",
        uid
      );

      const balanceRef = doc(
        db,
        "balance",
        uid
      );

      const activityRef = doc(
        db,
        "activity",
        uid
      );

      const othersRef = doc(
        db,
        "others",
        uid
      );

      // ======================================
      // 4. Atomic User ID Creation
      // ======================================

      let newUserID = "";

      await runTransaction(
        db,
        async (transaction) => {
          newUserID =
            await createUniqueUserID(
              transaction
            );

          // ----------------------------------
          // users
          // ----------------------------------

          const userData = {
            uid,

            userID: newUserID,

            email: cleanEmail,

            name: "",

            roll: "user",

            status: "active",

            createdAt:
              serverTimestamp(),
          };

          // Add referral information
          if (referrer) {
            userData.referredByUid =
              referrer.uid;

            userData.referredByUserID =
              referrer.userID;
          }

          transaction.set(
            userRef,
            userData
          );

          // ----------------------------------
          // balance
          // ----------------------------------

          transaction.set(
            balanceRef,
            {
              uid,
              amount: 0,
              updatedAt:
                serverTimestamp(),
            }
          );

          // ----------------------------------
          // activity
          // ----------------------------------

          transaction.set(
            activityRef,
            {
              uid,
              lastLogin: null,
              totalGames: 0,
              createdAt:
                serverTimestamp(),
            }
          );

          // ----------------------------------
          // others
          // ----------------------------------

          transaction.set(
            othersRef,
            {
              uid,
              vipLevel: 0,
              bonus: 0,
              referralCode:
                newUserID,
            }
          );
        }
      );

      // ======================================
      // 5. Referral Bonus Transaction
      // ======================================

      if (referrer) {
        await createReferralBonusTransaction(
          referrer,
          uid,
          newUserID
        );
      }

      // ======================================
      // 6. Signup Success
      // ======================================

      api.success({
        message:
          "Signup Successful",
        description: `Your User ID is ${newUserID}`,
      });

      setEmail("");
      setPassword("");
      setReferralUserID("");

      onClose();

      router.replace("/");
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      api.error({
        message: "Signup Failed",
        description:
          error?.message ||
          "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Create Referral Bonus Transaction
  // ==========================================

  const createReferralBonusTransaction =
    async (
      referrer,
      newUserUid,
      newUserID
    ) => {
      try {
        // ------------------------------------
        // Get Signup Bonus Rule
        // ------------------------------------

        const signupRuleRef =
          doc(
            db,
            "referralBonusRules",
            "signup"
          );

        const signupRuleSnapshot =
          await getDocs(
            query(
              collection(
                db,
                "referralBonusRules"
              ),
              where(
                "__name__",
                "==",
                "signup"
              )
            )
          );

        let percentage = 0;
        let enabled = true;

        if (
          !signupRuleSnapshot.empty
        ) {
          const rule =
            signupRuleSnapshot.docs[0].data();

          percentage = Number(
            rule.gen1 || 0
          );

          enabled =
            rule.enabled !== false;
        }

        // ------------------------------------
        // Create Transaction
        // ------------------------------------

        const transactionRef = doc(
          collection(
            db,
            "bonusTransactions"
          )
        );

        await import(
          "firebase/firestore"
        ).then(
          async ({
            setDoc,
            serverTimestamp,
          }) => {
            await setDoc(
              transactionRef,
              {
                receiverUid:
                  referrer.uid,

                receiverUserID:
                  referrer.userID,

                sourceUid:
                  newUserUid,

                sourceUserID:
                  newUserID,

                eventType:
                  "signup",

                generation: 1,

                baseAmount: 0,

                percentage,

                // Signup has no monetary
                // base amount in your current
                // rule structure.
                bonusAmount: 0,

                createdAt:
                  serverTimestamp(),

                status:
                  enabled
                    ? "completed"
                    : "disabled",
              }
            );
          }
        );
      } catch (error) {
        console.error(
          "Referral transaction failed:",
          error
        );

        // Do not stop signup if only
        // referral history fails.
      }
    };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async () => {
    if (activeTab === "login") {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  // ==========================================
  // OAuth
  // ==========================================

  const handleOAuthLogin = (
    provider
  ) => {
    api.info({
      message: `${provider} login coming soon`,
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      {contextHolder}

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}

        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={
            loading ? undefined : onClose
          }
        />

        {/* Modal */}

        <div className="relative w-[400px] max-w-[calc(100%-24px)] rounded-2xl bg-[#043d3b] p-6 shadow-2xl text-white z-10">
          {/* Close */}

          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-3 top-3 text-yellow-400 hover:rotate-90 transition disabled:opacity-50"
          >
            <X />
          </button>

          {/* Tabs */}

          <div className="flex justify-center mb-6">
            <button
              onClick={() => {
                setActiveTab("login");
                setReferralUserID("");
              }}
              className={`px-6 py-2 rounded-t-lg font-semibold ${
                activeTab === "login"
                  ? "bg-yellow-400 text-black"
                  : "bg-[#022b2a] text-gray-300"
              }`}
            >
              Login
            </button>

            <button
              onClick={() =>
                setActiveTab("signup")
              }
              className={`px-6 py-2 rounded-t-lg font-semibold ${
                activeTab === "signup"
                  ? "bg-yellow-400 text-black"
                  : "bg-[#022b2a] text-gray-300"
              }`}
            >
              Signup
            </button>
          </div>

          {/* Email */}

          <div className="mb-4 relative">
            <Mail
              className="absolute left-3 top-3 text-yellow-400"
              size={18}
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
            />
          </div>

          {/* Password */}

          <div className="mb-4 relative">
            <Lock
              className="absolute left-3 top-3 text-yellow-400"
              size={18}
            />

            <input
              type={
                showPass
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
            />

            <button
              type="button"
              onClick={() =>
                setShowPass(!showPass)
              }
              className="absolute right-3 top-2.5 text-gray-300"
              disabled={loading}
            >
              {showPass ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* ================================= */}
          {/* Referral Field - Signup Only */}
          {/* ================================= */}

          {activeTab === "signup" && (
            <div className="mb-4">
              <div className="relative">
                <Users
                  className="absolute left-3 top-3 text-yellow-400"
                  size={18}
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Referral User ID (Optional)"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                  value={
                    referralUserID
                  }
                  onChange={(e) =>
                    setReferralUserID(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  disabled={loading}
                />
              </div>

              <p className="text-[11px] text-gray-400 mt-1.5">
                Enter the 8-digit User ID of
                the person who referred you.
              </p>
            </div>
          )}

          {/* Submit */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold mb-4 hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : activeTab === "login"
              ? "লগইন"
              : "নিবন্ধন"}
          </button>

          {/* Social */}

          <p className="text-center text-sm text-gray-300 mb-3">
            অথবা লগইন করুন
          </p>

          <div className="flex gap-3">
            <button
              onClick={() =>
                handleOAuthLogin(
                  "Google"
                )
              }
              disabled={loading}
              className="flex-1 bg-red-600 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              Google
            </button>

            <button
              onClick={() =>
                handleOAuthLogin(
                  "Facebook"
                )
              }
              disabled={loading}
              className="flex-1 bg-blue-600 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
    </>
  );
}