import React, { useState, useEffect, useRef } from 'react'
import DownArrow from "../icon/arrow-down.svg"
import "./Home.css"

const randomNumbers = () => {
  return Array.from({ length: 5 }).map(e => 10 + Math.ceil(Math.random() * 100))
}

const Home = () => {
  const [options, setOptions] = useState(randomNumbers);
  const [inputState, setInputState] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);
  const dragging = useRef(null);
  const swap = useRef(false)


  const onDragStart = (e, value, isSwap) => {
    dragging.current = value;
    swap.current = isSwap
  }
  const onDrop = (e, destination) => {
    if (dragging.current !== null && destination !== undefined) {
      // if swap.current = true then dragging.current = index
      if (typeof destination === "number") {
        if (swap.current) {
          console.log(dragging.current)
          setInputState(old => ({
            ...old,
            [destination]: old[dragging.current],
            [dragging.current]: old[destination]
          }))
        } else {
          console.log("this runs")
          setInputState(old => ({
            ...old,
            [destination]: dragging.current
          }))
        }
      } else {

        setInputState(old => ({

          ...old,
          [dragging.current]: undefined
        }))
      }
    }
  }

  const handleOnReset = () => {
    setInputState({});
    setOptions(randomNumbers);
    setShowResult(false);
    setResult(false);
  }

  const checkResult = () => {
    const answer = options.map((v, i) => inputState[i])
    let sorted = true;
    for (let i = 0; i < answer.length - 1; i++) {
      if (answer[i] > answer[i + 1]) {
        sorted = false;
        break;
      }
    }

    setShowResult(true);
    setResult(sorted);
  }

  const onDragEnd = () => {
    dragging.current = null;
    swap.current = false;
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const inputStateArr = Object.values(inputState)

  const enableCheckBtn = !options.map((v, i) => inputState[i]).includes(undefined);

  return (
    <div className='homeContainer'>
      <div className="heading">Arrange the values in Ascending order</div>
      {
        showResult ?
          <div className='resultContainer'>
            <div className='resultHeading'>{result ? <>Correct Answer <img className='tick' src="https://static.vecteezy.com/system/resources/previews/017/177/933/original/round-check-mark-symbol-with-transparent-background-free-png.png" ></img></> : <>Wrong Answer <div className='cross'>X</div></>}</div>
            <button onClick={handleOnReset} className={result ? "correctBtn" : "resetBtn"}>RESET</button>
          </div>
          :
          <>
            <div className="dropContainer">
              {options.map((item, index) => (
                <div key={index}
                  draggable={inputState[index] !== undefined}
                  onDragStart={e => onDragStart(e, index, true)}
                  onDrop={e => onDrop(e, index)}
                  onDragOver={onDragOver}
                  className={inputState[index] ? "hideBorder" : "value"}
                >
                  <div className={inputState[index] ? "fiveDot" : "hideFiveDot"}>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                  </div>
                  <img className={inputState[index] ? "disableArrow" : "downArrowIcon"} src={DownArrow} />
                  <>{inputState[index] || "Drop"}</>
                </div>
              ))}
            </div>
            <div className="values" onDrop={e => onDrop(e, "bucket")} onDragOver={onDragOver}>
              {options.filter(item => !inputStateArr.includes(item)).map((item, index) => (
                <div key={index}
                  className={index === -1 ? "dragStarting" : "options"}
                  draggable
                  onDragEnd={onDragEnd}
                  onDragStart={e => onDragStart(e, item)}
                >
                  <div className='fiveDot'>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                  </div>
                  <>{item}</>
                </div>
              ))}
            </div>
            <button className="button" onClick={checkResult} disabled={enableCheckBtn ? false : true}>Check Answer</button>
          </>
      }
    </div >
  )
}

export default Home