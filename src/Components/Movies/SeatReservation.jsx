import "./SeatReservation.css";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Button } from "react-bootstrap";
import Banner from "./Banner";
import axios from "axios";
import PopUp from "./PopUp";

import Modal from 'react-modal';

export default function SeatReservation({ movie, movieEvent }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const bannerText = "Step 3 : Pick your seat!";
  
  return (
    <div>
      <Banner bannerText={bannerText} ImageUrl={movie.movieImage} />
      <div className="general_ciema">
        <div className="general_com">
          <ShowCase />
          <Cinema
            movie={movie}
            movieEvent={movieEvent}
            selectedSeats={selectedSeats}
            onSelectedSeatsChange={(selectedSeats) =>
              setSelectedSeats(selectedSeats)
            }
          />
        </div>
      </div>
    </div>
  );
}

function ShowCase() {
  return (
    <ul className="ShowCase">
      <li>
        <FontAwesomeIcon icon={faChair} size="1x" /> <small>Free</small>
      </li>
      <li>
        <FontAwesomeIcon icon={faChair} className="iconSelected" size="1x" />{" "}
        <small>Selected</small>
      </li>
      <li>
        <FontAwesomeIcon icon={faChair} className="iconOccupied" size="1x" />{" "}
        <small>Occupied</small>
      </li>
    </ul>
  );
}

function Cinema({ movie, movieEvent, selectedSeats, onSelectedSeatsChange }) {
  let navigate = useNavigate();
  const seats = Array.from(
    { length: 5 * (movieEvent.gridType * 2 + 2) },
    (_, i) => i
  );

  async function handleSubmit(e) {
    if (localStorage.getItem("token") == "") {
      if (window.confirm("Can't register you are a guest, Sign Up ??")) {
        navigate("/signup", { replace: true });
        return;
      }
    }
    e.preventDefault();
    const newR = {
      movieEventID: movieEvent._id,
      occupied: [...selectedSeats],
    };
    // id is auto incremented
    console.log(newR);
    const headers = {
      "x-access-token": localStorage.getItem("token"),
    };
    axios
      .post("http://localhost:5000/reserve/", newR, {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data);
        alert(res.data);
       
      })
      .catch((err) => {
        alert("reservation failed");
      });
    // //axios.post(insertUrl , newM );
  }

  function handleSelectedState(seat) {
    const isSelected = selectedSeats.includes(seat);
    if (isSelected) {
      onSelectedSeatsChange(
        selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
      );
    } else {
      onSelectedSeatsChange([...selectedSeats, seat]);
    }
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const setModalIsOpenToTrue =()=>{
      setModalIsOpen(true)
  }
  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      backgroundColor       : '#3b3b3b'      
    }
};

  return (
    <div className="Cinema">
      <div className="screen" />

      <div className="seats">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = movieEvent.occupied.includes(seat);
          return (
            <span
              tabIndex="0"
              key={seat}
              className={`seat ${isSelected && "selected"} ${
                isOccupied && "occupied"
              }`}
              onClick={isOccupied ? null : () => handleSelectedState(seat)}
            >
              <FontAwesomeIcon icon={faChair} size="1x" />
            </span>
          );
        })}
      </div>
      <Form onSubmit={handleSubmit}>
        <Button variant="primary" type="submit" className="w-100 mt-1" onClick={setModalIsOpenToTrue}>
          reserve seat
        </Button>
        <Modal style={customStyles}isOpen={modalIsOpen}>
           
           <PopUp/>
       </Modal>
      </Form>
     
    </div>
  );
}
