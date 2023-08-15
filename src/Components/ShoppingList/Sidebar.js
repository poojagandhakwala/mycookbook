import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

function Sidebar(props) {
  const colors = ["#fe9b72", "#fec971", " #00d4fe", "#b693fd", "#e4ee91"];
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="Sidebar">
      <button className="Add" onClick={() => setListOpen(!listOpen)}>
                <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon></button>
      <ul className={`Sidebar_list ${listOpen ? "Sidebar_list_active" : ""}`}>
        {colors.map((item, index) => (
          <li
            key={index}
            className="Sidebar_list_item"
            style={{ backgroundColor: item }}
            onClick={() => props.addNote(item)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;