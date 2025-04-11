let fileArray = [];
let time, file, button, count;

document.addEventListener("DOMContentLoaded", () => {
  time = document.getElementById("time");
  file = document.getElementById("file");
  button = document.getElementById("button");
  count = document.getElementById("count");

  // This is to ensure the file is empty when restarted/loaded in the first time.
  file.value = "";
  count.value = "";
  time.value = "";

  // Now call your setup functions after DOM is ready
  setupFile();
  setupCount();
  setupTime();
  setupButton();
});

// Checks if there's any changes on <input type="file">.
function setupFile() {
  document.getElementById("file").addEventListener("change", (event) => {
    styleFile();
    toggleButton();

    // Gets the first file uploaded into the <input type="file">.
    const file = event.target.files[0];

    // Checks if file is not empty.
    if (file) {
      const reader = new FileReader();

      // Once reader loads, breaks paragraph/sentence into individual words.
      reader.onload = (event) => {
        const contents = event.target.result.trim().split(" ");
        const contentArray = contents.map((word) => [word]);
        fileArray = [];

        // Logs each word as an array
        contentArray.forEach((element) => {
          fileArray.push(element);
        });
      };
      // Actually reads the file as text
      reader.readAsText(file);
    }
  });
}

// Adds style to <input type="file"> if not empty.
function styleFile() {
  const label = document.getElementById("label");
  const title = document.getElementById("title");

  if (label.value !== "") {
    label.style.backgroundColor = "salmon";
    label.style.color = "white";
    label.style.border = "1px solid salmon";
    title.innerHTML = file.value;
  }
}

function setupCount() {
  // Listens to keydown events inside <input type="number">
  count.addEventListener("keydown", (event) => {
    // Allowed keys for whole number input
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    // Allow digits and navigation keys
    if (
      (event.key >= "0" && event.key <= "9") ||
      allowedKeys.includes(event.key)
    ) {
      return;
    }

    // Block any non-integer characters like "."
    event.preventDefault();
  });

  // Checks input if it is not a number or value is 0
  count.addEventListener("input", () => {
    const value = parseInt(count.value, 10);

    if (isNaN(value) || value <= 0) {
      count.value = 1;
    }

    toggleButton();
  });
}

// Checks conditions for <input type="number" id="time">.
function setupTime() {
  // Listens to keydown events inside <input type="number">
  time.addEventListener("keydown", (event) => {
    // Allowed inputs in <input type="number">
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    // Checks if key pressed is allowed.
    if (
      (event.key >= "0" && event.key <= "9") ||
      allowedKeys.includes(event.key)
    ) {
      return;
    }

    // Checks if key pressed is ".".
    if (event.key === ".") {
      if (time.value.includes(".")) {
        event.preventDefault();
      }
      return;
    }

    // Prevents default events.
    event.preventDefault();
  });

  // Checks input if it is not a number or value is 0.
  time.addEventListener("input", () => {
    const value = parseFloat(time.value);

    if (isNaN(value) || value <= 0) {
      time.value = 1;
    }

    toggleButton();
  });
}

// Disable/enable button depending on <input> values.
function toggleButton() {
  if (file.value === "" || time.value === "" || count.value === "") {
    button.disabled = true;
  } else {
    button.classList.remove("bg-gray");
    button.classList.add("bg-salmon");
    button.style.cursor = "pointer";

    button.disabled = false;
  }
}

let timeId; // Declare timeId globally so we can clear it later
let timeoutIds = []; // Store timeouts in an array to clear them later

function setupButton() {
  const button = document.getElementById("button");
  const word = document.getElementById("word");
  const history = document.getElementById("history");
  const time = document.getElementById("time");
  const count = document.getElementById("count");

  button.addEventListener("click", () => {
    // Convert minutes to milliseconds
    const minutes = parseFloat(time.value) * 60000;
    const wordCount = minutes / count.value;
    const length = fileArray.length;
    let text = "";

    // Change button appearance to show "Stop"
    button.classList.remove("bg-salmon");
    button.classList.add("bg-darkgray");
    button.innerHTML = "Stop";

    if (button.getAttribute("data-toggle") === "start") {
      button.setAttribute("data-toggle", "stop");

      timeoutIds.forEach((id) => clearTimeout(id));
      timeoutIds = [];

      for (let i = 0; i < length; i++) {
        const timeoutId = setTimeout(() => {
          text += fileArray[i] + " ";
          word.innerHTML = fileArray[i];
          history.innerHTML = text;
        }, wordCount * i);
        timeoutIds.push(timeoutId);
      }

      setTimeout(() => {
        button.classList.remove("bg-darkgray");
        button.classList.add("bg-salmon");
        button.innerHTML = "Start";

        button.disabled = false;
        button.setAttribute("data-toggle", "start");
        word.innerHTML = "Digital Ent";
      }, wordCount * length);
    } else if (button.getAttribute("data-toggle") === "stop") {
      timeoutIds.forEach((id) => clearTimeout(id));
      timeoutIds = [];

      button.classList.remove("bg-darkgray");
      button.classList.add("bg-salmon");
      button.innerHTML = "Start";

      button.setAttribute("data-toggle", "start");
      button.disabled = false;
    }
  });
}
