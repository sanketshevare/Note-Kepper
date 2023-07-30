import React, { useRef, useState } from "react";
import { firestore } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import PaginatedItems from "./card";

export default function Home() {
  var newDate = new Date();
  var datetime =     new Date().toLocaleString();
  ;

console.log(datetime);
  const titleRef = useRef();
  const bodyRef = useRef();
  const tagRef = useRef();

  const ref = collection(firestore, "notes");

  // State variables for validation
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    // Reset previous validation errors
    setTitleError("");
    setBodyError("");

    const titleValue = titleRef.current.value.trim();
    const bodyValue = bodyRef.current.value.trim();
    const tagValue = tagRef.current.value.trim();

    // Check if title and body are not empty
    if (!titleValue) {
      setTitleError("Title is required.");
      return;
    }

    if (!bodyValue) {
      setBodyError("Body is required.");
      return;
    }

    let data = {
      title: titleValue,
      body: bodyValue,
      createdAt: datetime,
      tag: tagValue,
    };

    try {
      await addDoc(ref, data);
      // Clear input fields after successful save
      titleRef.current.value = "";
      bodyRef.current.value = "";
      tagRef.current.value = "";

      // Fetch the updated list of notes after a successful save
      // getNotes();
      window.location.href = "https://notekeeper-2d7ef.web.app/";
    } catch (e) {
      console.log(e);
    }
  };


  // Fetch the initial list of notes


  return (
    <div className=" bg-[url('../public/bg.jpg')] bg-center bg-no-repeat bg-cover flex flex-col items-center justify-center shadow-4xl">
      <div className="sticky top-0 w-full z-50">
        <h1 className="text-4xl font-bold p-3 text-blue-700 bg-lime-300  w-full">
          Note-Keeper
        </h1>
      </div>
      <div className="md:w-1/3 w-11/12 m-1 mb-5">
        <form
          onSubmit={handleSave}
          className="p-5 mt-10 bg-gray-500 flex flex-col rounded-lg shadow-lg"
        >
          <h1 className="text-3xl text-lime-400 font-bold mb-1">
            Add New Note:
          </h1>
          <input
            type="text"
            placeholder="Title..."
            ref={titleRef}
            className="p-3 focus:outline-none w-full rounded-md"
          />
          {titleError && <p className="text-cyan-300 text-md">{titleError}</p>}
          <br />
          <textarea
            type="text"
            placeholder="Take Note Here..."
            ref={bodyRef}
            rows={7}
            cols={23}
            className="p-3 w-full focus:outline-none rounded-md"
          />
          {bodyError && <p className="text-cyan-300 text-md">{bodyError}</p>}

          <br />
          <input
            type="text"
            placeholder="Tag..."
            ref={tagRef}
            className="p-3 focus:outline-none w-full rounded-md"
          />
          <br />

          <button
            type="submit"
            className="p-4 bg-amber-500 text-white rounded-md text-xl font-bold w-full"
          >
            Save
          </button>
        </form>
      </div>

      <div className="">
        <div className="">
          <PaginatedItems itemsPerPage={6} />
        </div>
      </div>
    </div>
  );
}
