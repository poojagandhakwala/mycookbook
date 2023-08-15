import React from "react";
import {
  doc,
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Context/firebase";
import { useEffect, useState } from "react";
import { storage } from "../Context/firebase";
import "firebase/storage";
import "./MyProfile.css";

export default function MyProfile() {
  const [user, loading, error] = useAuthState(auth);
  const [namee, setNamee] = useState("");
  const [idd, setIdd] = useState(0);

  let data;
  let id = 0;
  const fetchUserName = async () => {
    try {
      const q = query(
        collection(db, "LoginData"),
        where("uid", "==", user?.uid)
      );
      const doc = await getDocs(q);
      data = doc.docs[0].data();
      id = doc.docs[0].id;
      setIdd(doc.docs[0].id);
      // alert(id);
      setNamee(data.name);
    } catch (err) {
      // console.error(err);
      alert(err);
      alert("An error occured while fetching user data");
    }
  };

  const handleVisibility = async () => {
    try {
      fetchUserName();
      // const q = query(collection(db, "LoginData"), where("uid", "==", user?.uid));
      // const doc1 = await getDocs(q);
      // const data = doc.docs[0].data();
      // const id= doc1.docs[0].id;
      alert(idd);
      const profileRef = doc(db, "LoginData", idd);
      const docSnap = await getDoc(profileRef);
      let visible;
      if (document.getElementById("v1").checked)
        visible = document.getElementById("v1").value;
      else visible = document.getElementById("v2").value;
      alert("Value = " + visible + " for " + id);
      if (docSnap.exists()) {
        if (document.getElementById("v1").checked) {
          alert("docsnap exists for " + data.email);
          await updateDoc(
            profileRef,
            {
              name: data.name,
              email: data.email,
              authProvider: data.authProvider,
              profile: "Public",
            },
            { merge: true }
          );
        } else {
          await updateDoc(
            profileRef,
            {
              name: data.name,
              email: data.email,
              authProvider: data.authProvider,
              profile: "Private",
            },
            { merge: true }
          );
        }
        alert("Value updated for " + id);
      } else {
        alert("no docsnap");
      }
      alert("at end");
    } catch (err) {
      console.error(err);
      alert(err);
      // alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    fetchUserName();
  }, [user, loading]);

  return (
    <div>
      <div className="main-content">
        {/* Header */}
        <div
          className="header pb-8 pt-5 pt-md-8 d-flex align-items-center"
          style={{
            minHeight: 600,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <div className="container-fluid d-flex align-items-center">
            <div className="row">
              <div className="col-lg-7 col-md-10">
                <h1 className="display-2 text-black">Hello, {namee} </h1>
                <p className="text-black mt-0 mb-10">
                  This is your profile page. You can see your name and e-mail
                  and also change your password.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Page content */}
        <div className="container-fluid mt-7">
          <div className="row">
            <div className="col-xl-4 order-xl-2 mb-5 mb-xl-0">
              <div
                className="profile profile-profile shadow"
                style={{ width: "103%", height: "100%" }}
              >
                <div
                  className="img-upload"
                  style={{ marginLeft: "30%", marginTop: "5%" }}
                >
                  <img
                    src={user ? user.photoURL : ""}
                    alt="profile-image"
                    className="rounded-circle"
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="profile-body pt-0 pt-md-4">
                  <div className="text-center" style={{ marginTop: "15%" }}>
                    <h2>{namee}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-8 order-xl-1">
              <div
                className="profile-mp bg-secondary shadow"
                style={{ borderStyle: "solid", borderColor: "white" }}
              >
                <div className="profile-header bg-white border-0">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h3 className="mb-0">My account</h3>
                    </div>
                    <div className="col-4 text-right">
                      <a href="change">
                        <button
                          className="btn btn-sm btn-primary"
                          style={{
                            width: "80%",
                            fontSize: "16px",
                            marginLeft: "10%",
                          }}
                        >
                          Change Password
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="profile-body"
                  style={{ backgroundColor: "white" }}
                >
                  <form onSubmit={handleVisibility}>
                    <h6 className="heading-small text-muted mb-4 ">
                      User information
                    </h6>
                    <div className="pl-lg-10">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group focused">
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="input-username"
                              className="form-control form-control-alternative"
                              placeholder={namee}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <br /> <br />
                      <div className="row mt-0">
                        <div className="col-lg-6 ">
                          <div className="form-group">
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <input
                              type="email"
                              id="input-email"
                              className="form-control form-control-alternative"
                              placeholder={user?.email}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-lg-6">
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Visibility
                          </label>
                          <div className="radio">
                            <label
                              htmlFor="visiblity"
                              style={{ display: "inline-flex" }}
                            >
                              <input
                                type="radio"
                                name="visibility"
                                id="v1"
                                value="Public"
                                style={{
                                  marginRight: "20px",
                                }}
                              />
                              Public
                            </label>
                            <br />
                            <label
                              htmlFor="visiblity"
                              style={{ display: "inline-flex" }}
                            >
                              <input
                                type="radio"
                                name="visibility"
                                id="v2"
                                value="Private"
                                style={{
                                  marginRight: "20px",
                                }}
                              />
                              Private
                            </label>
                            <br />
                          </div>
                          <button
                            className="btn btn-primary col-lg-5"
                            type="submit"
                            onClick={handleVisibility}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
