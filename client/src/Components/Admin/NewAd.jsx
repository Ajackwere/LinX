import React from "react";
import "../../Styles/Account/newpost.css";
import TextEditor from "../Reusables/TextEditor";

function NewAd() {
  return (
    <div>
      <section className="newpost-head">
        <input type="text" placeholder="Title" />
        <button>POST</button>
      </section>
      <section>
        <TextEditor />
      </section>
    </div>
  );
}

export default NewAd;
