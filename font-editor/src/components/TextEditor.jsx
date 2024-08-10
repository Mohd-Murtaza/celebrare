import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { Rnd } from "react-rnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBold, FaItalic, FaUndo, FaRedo, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const containerRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const addText = () => {
    const newElement = {
      id: Date.now(),
      text,
      styles: {
        color: "black",
        fontFamily: "Arial",
        fontSize: "16px",
        fontWeight: "normal",
        fontStyle: "normal",
        textTransform: "none",
      },
      position: {
        x: 0,
        y: 0,
        width: "auto",
        height: "auto",
      },
    };
    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    saveState(updatedElements);
    setShowModal(false);
  };

  const saveState = (updatedElements = elements) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(updatedElements);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setElements(history[currentIndex - 1]);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setElements(history[currentIndex + 1]);
    }
  };

  const updateSelectedElementStyle = (newStyle) => {
    if (selectedElementIndex !== null) {
      const updatedElements = elements.map((element, index) =>
        index === selectedElementIndex
          ? { ...element, styles: { ...element.styles, ...newStyle } }
          : element
      );
      setElements(updatedElements);
      saveState(updatedElements);
    }
  };

  const changeTextColor = (color) => updateSelectedElementStyle({ color });
  const changeFontFamily = (fontFamily) => {
    updateSelectedElementStyle({ fontFamily });
    toast(`Font Style Updated ${fontFamily}`);
  };
  const changeFontSize = (fontSize) => {
    updateSelectedElementStyle({ fontSize });
    toast(`Font Size Updated ${fontSize}`);
  };
  const toggleBold = () =>
    updateSelectedElementStyle({
      fontWeight:
        elements[selectedElementIndex]?.styles.fontWeight === "bold"
          ? "normal"
          : "bold",
    });
  const toggleItalic = () =>
    updateSelectedElementStyle({
      fontStyle:
        elements[selectedElementIndex]?.styles.fontStyle === "italic"
          ? "normal"
          : "italic",
    });
  const toggleUppercase = () =>
    updateSelectedElementStyle({
      textTransform:
        elements[selectedElementIndex]?.styles.textTransform === "uppercase"
          ? "none"
          : "uppercase",
    });
  const toggleLowercase = () =>
    updateSelectedElementStyle({
      textTransform:
        elements[selectedElementIndex]?.styles.textTransform === "lowercase"
          ? "none"
          : "lowercase",
    });

  const deleteElement = () => {
    if (selectedElementIndex !== null) {
      const updatedElements = elements.filter((_, index) => index !== selectedElementIndex);
      setElements(updatedElements);
      setSelectedElementIndex(null);
      saveState(updatedElements);
    }
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setSelectedElementIndex(null);
    }
  };

  useEffect(() => {
    saveState();
  }, [text]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <ToastContainer />
      <div className="toolbar">
        <Button onClick={undo}>
          <FaUndo />
        </Button>
        <Button onClick={redo}>
          <FaRedo />
        </Button>
        <Button onClick={toggleBold}>
          <FaBold />
        </Button>
        <Button onClick={toggleItalic}>
          <FaItalic />
        </Button>
        <Button onClick={toggleUppercase}>Uppercase</Button>
        <Button onClick={toggleLowercase}>Lowercase</Button>
        <Button onClick={() => setShowModal(true)}>Add Text</Button>
        <Dropdown onSelect={changeFontFamily}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Font Family
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Arial">Arial</Dropdown.Item>
            <Dropdown.Item eventKey="Times New Roman">
              Times New Roman
            </Dropdown.Item>
            <Dropdown.Item eventKey="Courier New">Courier New</Dropdown.Item>
            <Dropdown.Item eventKey="Gill Sans">Gill Sans</Dropdown.Item>
            <Dropdown.Item eventKey="sans-serif">Sans-Serif</Dropdown.Item>
            <Dropdown.Item eventKey="monospace">Monospace</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={changeFontSize}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Font Size
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="12px">12px</Dropdown.Item>
            <Dropdown.Item eventKey="14px">14px</Dropdown.Item>
            <Dropdown.Item eventKey="16px">16px</Dropdown.Item>
            <Dropdown.Item eventKey="18px">18px</Dropdown.Item>
            <Dropdown.Item eventKey="20px">20px</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <input
          type="color"
          onChange={(e) => changeTextColor(e.target.value)}
        />
      </div>
      <div className="parentEditor-container">
        <div className="editor-container">
          {elements.map((element, index) => (
            <Rnd
              key={element.id}
              default={element.position}
              bounds="parent"
              onDragStop={(e, d) => {
                const updatedElements = elements.map((el, i) =>
                  i === index
                    ? { ...el, position: { ...el.position, x: d.x, y: d.y } }
                    : el
                );
                setElements(updatedElements);
                saveState(updatedElements);
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                const updatedElements = elements.map((el, i) =>
                  i === index
                    ? {
                        ...el,
                        position: {
                          ...el.position,
                          width: ref.style.width,
                          height: ref.style.height,
                          ...position,
                        },
                      }
                    : el
                );
                setElements(updatedElements);
                saveState(updatedElements);
              }}
              enableUserSelectHack={false}
            >
              <div
                style={{ ...element.styles, position: 'relative' }}
                onClick={() => setSelectedElementIndex(index)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setSelectedElementIndex(index);
                }}
                contentEditable
                suppressContentEditableWarning
              >
                {element.text}
                {selectedElementIndex === index && (
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement();
                    }}
                    onTouchStart={(e) => e.stopPropagation()} // Ensure touch events don't interfere
                    style={{
                      position: 'absolute',
                      top: -35,
                      right: -40,
                      zIndex: 10,
                    }}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            </Rnd>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Text</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={text}
            onChange={handleTextChange}
            rows="4"
            cols="50"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addText}>
            Add Text
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TextEditor;