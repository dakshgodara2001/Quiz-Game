import React, { useState, useRef, useCallback } from 'react'
import "./Home.css"

import DownArrow from "./icon/down_arrow.svg"

const randomNumbers = () => {
  let numbers = new Set();
  while(numbers.size < 5) {
    numbers.add(10 + Math.ceil(Math.random() * 100));
  }
  return Array.from(numbers);
}

const Home = () => {
  const [options, setOptions] = useState(randomNumbers);
  const [inputState, setInputState] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);
  const dragging = useRef(null);
  const swap = useRef(false)


  const onDragStart = useCallback((e, value, isSwap) => {
    dragging.current = value;
    swap.current = isSwap;
  }, []);

  const onDrop = useCallback((e, destination) => {
    if (dragging.current !== null && destination !== undefined) {
      if (typeof destination === "number") {
        if (swap.current && inputState[destination] !== dragging.current) {
          setInputState(old => ({
            ...old,
            [destination]: old[dragging.current],
            [dragging.current]: old[destination]
          }));
        } else if (!swap.current && !Object.values(inputState).includes(dragging.current)) {
          setInputState(old => ({
            ...old,
            [destination]: dragging.current
          }));
        }
      } else {
        setInputState(old => ({
          ...old,
          [dragging.current]: undefined
        }));
      }
    }
  }, [inputState]);
  

  const onDragEnd = useCallback(() => {
    dragging.current = null;
    swap.current = false;
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);


  const handleOnReset = useCallback(() => {
    setInputState({});
    setOptions(randomNumbers);
    setShowResult(false);
    setResult(false);
  }, []);


  const checkResult = useCallback(() => {
    const answer = options.map((v, i) => inputState[i])
    let sorted = answer.every((v, i, a) => !i || a[i-1] <= v);

    setShowResult(true);
    setResult(sorted);
  }, [options, inputState]);



  const inputStateArr = Object.values(inputState)
  const answer = options.map((v, i) => inputState[i]);
  const enableCheckBtn = !answer.includes(undefined);
  
  return (
    <div className='homeContainer'>
      <div className="heading">Arrange the values in Ascending order</div>
      {
        showResult ?
          <div className='resultContainer'>
            <div className='resultHeading'>
              {result ? (
                <>Correct Answer <img className='tick' src="https://static.vecteezy.com/system/resources/previews/017/177/933/original/round-check-mark-symbol-with-transparent-background-free-png.png" alt="Tick Mark" /></>
              ) : (
                <>Wrong Answer <div className='cross'>X</div></>
              )}
            </div>
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
                  <img className={inputState[index] ? "disableArrow" : "downArrowIcon"} src={DownArrow} alt={inputState[index] ? "Disabled Arrow" : "Down Arrow"} />
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
