import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import axios from "axios";
import NotesIcon from "@mui/icons-material/Notes";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import NetworkGraph from "../components/NetworkGraph";
import Login from "../components/loginModal";
import SignUp from "../components/signUpModal";
import FolderIcon from "@mui/icons-material/Folder";
import Projects from "../components/projectsModal";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const [networkVisible, setNetworkVisible] = useState(false);
  const [notesVisible, setNotesVisible] = useState(false);

  const [currentWikiPage, setCurrentWikiPage] = useState("");

  const [currentUser, setCurrentUser] = useState("");

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);

  const [currentNetworkName, setCurrentNetworkName] = useState("");

  const nodeData = useRef([]);
  const edgeData = useRef([]);
  const nodeIndex = useRef(0);

  const [notes, setNotes] = useState("");

  const [networkCreated, setNetworkCreated] = useState(false);

  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    fetchWikiPage(currentWikiPage);

    const currNodeData = nodeData.current;
    if (!currNodeData[nodeIndex.current]) return;
    setNotes(currNodeData[nodeIndex.current]?.notes);
  }, [currentWikiPage, nodeIndex]);

  const handleSearchTextChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    if (
      !search ||
      search.length === 0 ||
      !currentUser ||
      currentUser.length === 0
    )
      return;
    createRoot(search);
    setSearch("");
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleOpenProjects = () => {
    getNetworks();
    setOpenProjects(true);
  };

  const handleCloseProjects = () => {
    setOpenProjects(false);
  };
  const createRoot = (name) => {
    console.log("CREATE ROOOT");
    setNotes("");

    edgeData.current = [];

    nodeIndex.current = 0;

    nodeData.current = [""];

    setCurrentNetworkName(name);
    setCurrentWikiPage(name);
    setNetworkCreated(false);

    nodeData.current = [{ id: 0, label: name, notes: "" }];
  };

  const getNetworks = () => {
    if (currentUser === "") return;
    axios
      .get("http://localhost:3001/networks")
      .then((response) => {
        const data = JSON.parse(response.data);

        const userNetworks = [];
        data.forEach((row) => {
          if (row["user_name"] === currentUser) {
            userNetworks.push(row["network_name"]);
          }
        });

        setNetworks(userNetworks);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createNetwork = () => {
    setNetworkCreated(true);
    axios
      .post("http://localhost:3001/createNetwork", {
        networkName: currentNetworkName,
        userName: currentUser,
        data: {
          nodes: JSON.stringify(nodeData.current),
          edges: JSON.stringify(edgeData.current),
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateNetwork = () => {
    axios
      .post("http://localhost:3001/updateNetwork", {
        networkName: currentNetworkName,
        userName: currentUser,
        data: {
          nodes: JSON.stringify(nodeData.current),
          edges: JSON.stringify(edgeData.current),
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  const expandNetwork = (page) => {
    let index = nodeData.current.length;

    const fromIndex = nodeIndex.current;

    let newNodeData = [
      ...nodeData.current,
      {
        id: index,
        label: page,
        notes: "",
      },
    ];
    let newEdgeData = [...edgeData.current, { to: index, from: fromIndex }];

    nodeIndex.current = index;
    nodeData.current = newNodeData;
    edgeData.current = newEdgeData;

    setNotes("");

    setCurrentWikiPage(page);
  };

  const fetchWikiPage = (name) => {
    setCurrentWikiPage(name);

    fetch(`https://en.wikipedia.org/w/rest.php/v1/page/${name}/html`)
      .then((response) => response.text())
      .then((html) => {
        const wikiPage = document.getElementById("pageDisplay");
        wikiPage.innerHTML = html;

        const anchorTags = document.getElementsByTagName("a");

        const anchorTagsArr = [...anchorTags];

        anchorTagsArr.forEach((tag, i) => {
          const href = anchorTags[i].getAttribute("href");

          tag.addEventListener("click", (e) => {
            e.preventDefault();

            const wikiPage = href.slice(2);

            expandNetwork(wikiPage);
          });
        });
      })
      .catch((e) => console.log(e));
  };

  const toggleNetwork = () => {
    const networkDisplay = document.getElementById("networkDisplay");

    if (networkVisible) {
      networkDisplay.setAttribute("hidden", "hidden");
    } else {
      networkDisplay.removeAttribute("hidden");
    }

    setNetworkVisible(!networkVisible);
  };

  const toggleNotes = () => {
    const notesDisplay = document.getElementById("notesDisplay");

    if (notesVisible) {
      notesDisplay.setAttribute("hidden", "hidden");
    } else {
      notesDisplay.removeAttribute("hidden");
    }

    setNotesVisible(!notesVisible);
  };

  const handleNotesChange = (e) => {
    const enteredNotes = e.target.value;
    const oldNodeData = nodeData.current;

    if (!currentWikiPage || currentWikiPage.length === 0) return;
    if (oldNodeData.length === 0) return;

    nodeData.current = updateNotesAtIndex(
      oldNodeData,
      nodeIndex.current,
      enteredNotes
    );
    setNotes(enteredNotes);
  };

  function updateNotesAtIndex(jsonArray, index, newNote) {
    if (index < 0 || index >= jsonArray.length) {
      throw new Error("Index out of bounds");
    }

    jsonArray[index].notes = newNote;

    return jsonArray;
  }

  const changeNetwork = (network) => {
    handleCloseProjects();

    axios
      .get("http://localhost:3001/networks")
      .then((response) => {
        const data = JSON.parse(response.data);

        data.forEach((row) => {
          console.log(row);
          console.log(currentUser);
          console.log(network.network);
          if (
            row["user_name"] === currentUser &&
            row["network_name"] === network.network
          ) {
            const networkData = row["data"];

            console.log(networkData);

            const newNodeData = JSON.parse(networkData["nodes"]);
            const newEdgeData = JSON.parse(networkData["edges"]);

            nodeData.current = [...newNodeData];
            edgeData.current = [...newEdgeData];
            nodeIndex.current = 0;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setCurrentWikiPage(network);
    fetchWikiPage(network);
    setCurrentNetworkName(network);
  };

  const deleteNetwork = (network) => {
    handleCloseProjects();

    axios
      .post("http://localhost:3001/delete", {
        networkName: network.network,
        userName: currentUser,
      })
      .then(() => {
        console.log("Successfully deleted network!");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>Wiki-Net</h1>
      <div style={{ background: "skyBlue" }}>
        <TextField
          label="Search Wiki"
          size="small"
          variant="outlined"
          value={search}
          onChange={handleSearchTextChange}
          sx={{ margin: "1% 1% 1%", backgroundColor: "white" }}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={handleSearch}
          sx={{ margin: "1% 0% 1%" }}
        >
          Search
        </Button>
        <IconButton
          color="primary"
          variant="contained"
          onClick={toggleNetwork}
          sx={{ margin: "1% 1% 1% 50%" }}
        >
          <AccountTreeOutlinedIcon />
        </IconButton>
        {currentWikiPage === "" || currentWikiPage === undefined ? (
          <IconButton
            color="primary"
            variant="contained"
            onClick={toggleNotes}
            sx={{ margin: "1% 2% 1% 1%" }}
          >
            <NotesIcon />
          </IconButton>
        ) : (
          ""
        )}
        {currentUser !== "" ? (
          <IconButton
            color="primary"
            variant="contained"
            onClick={() => handleOpenProjects()}
            sx={{ margin: "1% 2% 1% 1%" }}
          >
            <FolderIcon />
          </IconButton>
        ) : (
          ""
        )}
        {currentUser === "" ? (
          <Button
            variant="contained"
            color="primary"
            id="login"
            onClick={() => handleOpenLogin()}
          >
            Login
          </Button>
        ) : (
          `Welcome ${currentUser}`
        )}
        {currentUser === "" ? (
          <Button
            sx={{ marginLeft: "1%" }}
            variant="contained"
            color="primary"
            id="signup"
            onClick={() => handleOpenSignUp()}
          >
            Sign Up
          </Button>
        ) : (
          ""
        )}
      </div>
      <div>
        <div
          id="networkDisplay"
          style={{
            height: "500px",
            border: "solid black 1px",
            margin: "1% 1% 1% 1%",
          }}
          hidden
        >
          <NetworkGraph
            edgeData={edgeData}
            nodeData={nodeData}
            currentWikiPage={currentWikiPage}
            setCurrentWikiPage={setCurrentWikiPage}
            nodeIndex={nodeIndex}
            networkCreated={networkCreated}
            updateNetwork={updateNetwork}
            createNetwork={createNetwork}
          />
        </div>
        <div id="notesDisplay" style={{ margin: "1% 1% 1% 1%" }} hidden>
          <TextField
            id="notes"
            margin="normal"
            label={`Notes on ${currentWikiPage}`}
            rows={6}
            value={notes}
            onChange={handleNotesChange}
            multiline
            fullWidth
          ></TextField>
        </div>
        <div
          id="pageDisplay"
          style={{
            border: "solid black 1px",
            margin: "1% 1% 1% 1%",
            padding: "1% 1% 1% 1%",
          }}
        ></div>
      </div>
      <SignUp
        open={openSignUp}
        handleClose={handleCloseSignUp}
        setCurrentUser={setCurrentUser}
      />
      <Login
        open={openLogin}
        handleClose={handleCloseLogin}
        setCurrentUser={setCurrentUser}
      />
      <Projects
        open={openProjects}
        handleClose={handleCloseProjects}
        currentUser={currentUser}
        networks={networks}
        changeNetwork={changeNetwork}
        deleteNetwork={deleteNetwork}
      ></Projects>
    </div>
  );
}
